from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.crud.donor import get_donor_by_public_id
from app.crud.requester import get_requester_by_public_id
from app.models.donor import Donor
from app.models.requester import Requester

from app.crud.donor import get_donor_by_phone
from app.crud.requester import get_requester_by_phone

from typing import Union

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", scheme_name="DonorAuth")
requester_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/requester-auth/login", scheme_name="RequesterAuth"
)

oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login", scheme_name="DonorAuth", auto_error=False
)
requester_oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/v1/requester-auth/login", scheme_name="RequesterAuth", auto_error=False
)
http_bearer_optional = HTTPBearer(auto_error=False)


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


# --- add below existing get_current_donor / get_current_requester ---


def get_current_donor_or_requester(
    donor_token: str | None = Depends(oauth2_scheme_optional),
    requester_token: str | None = Depends(requester_oauth2_scheme_optional),
    http_token: HTTPAuthorizationCredentials | None = Depends(http_bearer_optional),
    db: Session = Depends(get_db),
) -> tuple[str, Union[Donor, Requester]]:
    """Accepts either a donor or requester token. Returns (role, user_object)."""
    raw_tokens = [
        requester_token,
        donor_token,
        http_token.credentials if http_token else None,
    ]
    tokens = [t for t in raw_tokens if t]

    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    for token in tokens:
        payload = decode_access_token(token)
        if not payload:
            continue
        role = payload.get("role")
        if role == "donor":
            donor = get_donor_by_public_id(db, payload.get("sub"))
            if donor:
                return "donor", donor
        elif role == "requester":
            requester = get_requester_by_public_id(db, payload.get("sub"))
            if requester:
                return "requester", requester

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )