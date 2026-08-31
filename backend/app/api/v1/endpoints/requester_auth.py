from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.crud.requester import create_requester, get_requester_by_phone
from app.schemas.requester import RequesterOut, RequesterSignup
from app.schemas.token import Token

router = APIRouter(prefix="/requester-auth", tags=["requester-auth"])


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
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    requester = get_requester_by_phone(db, form_data.username)
    if not requester or not verify_password(form_data.password, requester.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(requester.public_id), "role": "requester"})
    return Token(access_token=access_token)