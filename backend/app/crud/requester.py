import uuid

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.requester import Requester
from app.schemas.requester import RequesterSignup


def get_requester_by_phone(db: Session, phone_number: str) -> Requester | None:
    return db.query(Requester).filter(Requester.phone_number == phone_number).first()


def get_requester_by_public_id(db: Session, public_id: str | uuid.UUID) -> Requester | None:
    str_val = str(public_id)
    try:
        requester = db.query(Requester).filter(Requester.public_id == str_val).first()
        if requester is not None:
            return requester
    except Exception:
        pass

    try:
        uuid_val = uuid.UUID(str_val) if not isinstance(public_id, uuid.UUID) else public_id
        return db.query(Requester).filter(Requester.public_id == uuid_val).first()
    except Exception:
        return None


def create_requester(db: Session, requester_in: RequesterSignup) -> Requester:
    requester = Requester(
        name=requester_in.name,
        phone_number=requester_in.phone_number,
        address=requester_in.address,
        hashed_password=hash_password(requester_in.password),
    )
    db.add(requester)
    db.commit()
    db.refresh(requester)
    return requester