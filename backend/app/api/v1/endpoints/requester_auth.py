from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
import random
import time

from app.core.database import get_db
from app.core.phone import normalize_phone, phone_variants
from app.core.security import create_access_token, hash_password, verify_password
from app.crud.requester import create_requester, get_requester_by_phone
from app.rate_limit import check_rate_limit, reset_rate_limit
from app.schemas.requester import RequesterOut, RequesterSignup
from app.schemas.token import Token

router = APIRouter(prefix="/requester-auth", tags=["requester-auth"])

# In-memory reset code store for testing
_reset_codes: dict[str, dict] = {}


class ForgotPasswordRequest(BaseModel):
    phone_number: str


class VerifyCodeRequest(BaseModel):
    phone_number: str
    code: str


class ResetPasswordRequest(BaseModel):
    phone_number: str
    code: str
    new_password: str


@router.post("/signup", response_model=RequesterOut, status_code=status.HTTP_201_CREATED)
def signup_requester(requester_in: RequesterSignup, db: Session = Depends(get_db)):
    if get_requester_by_phone(db, requester_in.phone_number):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A requester with this phone number already exists.",
        )
    requester = create_requester(db, requester_in)
    return requester


@router.post("/login", response_model=Token)
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(client_ip)

    # Try the canonical +92 form first, then legacy stored formats (0300..., 300...).
    requester = None
    for candidate in phone_variants(form_data.username):
        requester = get_requester_by_phone(db, candidate)
        if requester:
            break
    if requester is None:
        requester = get_requester_by_phone(db, normalize_phone(form_data.username))
    if not requester or not verify_password(form_data.password, requester.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    reset_rate_limit(client_ip)
    access_token = create_access_token(data={"sub": str(requester.public_id), "role": "requester"})
    return Token(access_token=access_token)


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(req.phone_number)
    requester = None
    for candidate in phone_variants(req.phone_number):
        requester = get_requester_by_phone(db, candidate)
        if requester:
            break
    if requester is None:
        requester = get_requester_by_phone(db, phone)

    # Always return success to prevent phone enumeration
    code = f"{random.randint(100000, 999999)}"
    _reset_codes[phone] = {
        "code": code,
        "expires": time.time() + 600,  # 10 minutes
    }
    print(f"\n{'='*50}")
    print(f"[REQUESTER RESET CODE] Phone: {phone}  Code: {code}")
    print(f"{'='*50}\n")
    return {"message": "If an account exists, a reset code has been sent to your phone."}


@router.post("/verify-reset-code")
def verify_reset_code(req: VerifyCodeRequest):
    phone = normalize_phone(req.phone_number)
    entry = _reset_codes.get(phone)
    if not entry or entry["code"] != req.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code.",
        )
    if time.time() > entry["expires"]:
        del _reset_codes[phone]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code.",
        )
    return {"message": "Code verified. You may now reset your password."}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(req.phone_number)
    entry = _reset_codes.get(phone)
    if not entry or entry["code"] != req.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code.",
        )
    if time.time() > entry["expires"]:
        del _reset_codes[phone]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code.",
        )

    requester = None
    for candidate in phone_variants(req.phone_number):
        requester = get_requester_by_phone(db, candidate)
        if requester:
            break
    if requester is None:
        requester = get_requester_by_phone(db, phone)
    if not requester:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code.",
        )

    requester.hashed_password = hash_password(req.new_password)
    db.commit()
    del _reset_codes[phone]
    return {"message": "Password reset successfully. You can now log in."}