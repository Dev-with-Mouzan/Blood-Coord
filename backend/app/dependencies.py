# get_db, get_current_user, etc.
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.crud.donor import get_donor_by_phone
from app.models.donor import Donor

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_donor(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Donor:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    phone_number = payload.get("sub")
    if phone_number is None:
        raise credentials_exception

    donor = get_donor_by_phone(db, phone_number)
    if donor is None:
        raise credentials_exception

    return donor
