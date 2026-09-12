from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
import random
import time

from app.core.database import get_db
from app.core.phone import normalize_phone, phone_variants
from app.core.security import create_access_token, hash_password, verify_password
from app.crud.donor import create_donor, get_donor_by_phone
from app.rate_limit import check_rate_limit, reset_rate_limit
from app.schemas.donor import DonorOut, DonorSignup
from app.schemas.token import Token

router = APIRouter(prefix="/auth", tags=["donor-auth"])

# In-memory reset code store for testing
# { phone: { code: str, expires: float, new_password: str } }
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


@router.post("/signup", response_model=DonorOut, status_code=status.HTTP_201_CREATED)
def signup_donor(donor_in: DonorSignup, db: Session = Depends(get_db)):
    if get_donor_by_phone(db, donor_in.phone_number):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A donor with this phone number already exists.",
        )
    donor = create_donor(db, donor_in)
    return donor


@router.post("/login", response_model=Token)
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(client_ip)

    # Try the canonical +92 form first, then legacy stored formats (0300..., 300...).
    donor = None
    for candidate in phone_variants(form_data.username):
        donor = get_donor_by_phone(db, candidate)
        if donor:
            break
    if donor is None:
        donor = get_donor_by_phone(db, normalize_phone(form_data.username))
    if not donor or not verify_password(form_data.password, donor.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    reset_rate_limit(client_ip)
    access_token = create_access_token(data={"sub": str(donor.public_id), "role": "donor"})
    return Token(access_token=access_token)


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(req.phone_number)
    donor = None
    for candidate in phone_variants(req.phone_number):
        donor = get_donor_by_phone(db, candidate)
        if donor:
            break
    if donor is None:
        donor = get_donor_by_phone(db, phone)

    # Always return success to prevent phone enumeration
    code = f"{random.randint(100000, 999999)}"
    _reset_codes[phone] = {
        "code": code,
        "expires": time.time() + 600,  # 10 minutes
    }
    print(f"\n{'='*50}")
    print(f"[DONOR RESET CODE] Phone: {phone}  Code: {code}")
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

    donor = None
    for candidate in phone_variants(req.phone_number):
        donor = get_donor_by_phone(db, candidate)
        if donor:
            break
    if donor is None:
        donor = get_donor_by_phone(db, phone)
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code.",
        )

    donor.hashed_password = hash_password(req.new_password)
    db.commit()
    del _reset_codes[phone]
    return {"message": "Password reset successfully. You can now log in."}