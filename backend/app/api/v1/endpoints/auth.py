# signup/login, phone verification

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.crud.donor import create_donor, get_donor_by_phone
from app.schemas.donor import DonorOut, DonorSignup, Token

router = APIRouter(prefix="/auth", tags=["auth"])


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
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm sends "username" — we treat that field as phone_number
    donor = get_donor_by_phone(db, form_data.username)
    if not donor or not verify_password(form_data.password, donor.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": donor.phone_number})
    return Token(access_token=access_token)
