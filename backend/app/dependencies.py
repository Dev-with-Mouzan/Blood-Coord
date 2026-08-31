from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.crud.donor import get_donor_by_public_id
from app.crud.requester import get_requester_by_public_id
from app.models.donor import Donor
from app.models.requester import Requester

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", scheme_name="DonorAuth")
requester_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/requester-auth/login", scheme_name="RequesterAuth"
)


def _decode_or_401(token: str) -> dict:
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def get_current_donor(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Donor:
    payload = _decode_or_401(token)
    if payload.get("role") != "donor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Donor token required")
    donor = get_donor_by_public_id(db, payload.get("sub"))
    if donor is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Donor not found")
    return donor


def get_current_requester(
    token: str = Depends(requester_oauth2_scheme), db: Session = Depends(get_db)
) -> Requester:
    payload = _decode_or_401(token)
    if payload.get("role") != "requester":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requester token required")
    requester = get_requester_by_public_id(db, payload.get("sub"))
    if requester is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Requester not found")
    return requester