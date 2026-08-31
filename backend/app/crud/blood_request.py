import uuid

from sqlalchemy.orm import Session

from app.models.blood_request import BloodRequest
from app.schemas.blood_request import BloodRequestCreate


def create_blood_request(
    db: Session, request_in: BloodRequestCreate, requester_id: int
) -> BloodRequest:
    blood_request = BloodRequest(
        requester_id=requester_id,
        blood_type=request_in.blood_type.value,
        address=request_in.address,
        hospital=request_in.hospital,
        units_needed=request_in.units_needed,
        urgency=request_in.urgency.value,
        patient_context=request_in.patient_context,
        status="PENDING",
    )
    db.add(blood_request)
    db.commit()
    db.refresh(blood_request)
    return blood_request


def get_blood_requests_by_requester(db: Session, requester_id: int) -> list[BloodRequest]:
    return (
        db.query(BloodRequest)
        .filter(BloodRequest.requester_id == requester_id)
        .order_by(BloodRequest.created_at.desc())
        .all()
    )


def get_blood_request_by_public_id(db: Session, public_id: str | uuid.UUID) -> BloodRequest | None:
    str_val = str(public_id)
    try:
        req = db.query(BloodRequest).filter(BloodRequest.public_id == str_val).first()
        if req is not None:
            return req
    except Exception:
        pass

    try:
        uuid_val = uuid.UUID(str_val) if not isinstance(public_id, uuid.UUID) else public_id
        return db.query(BloodRequest).filter(BloodRequest.public_id == uuid_val).first()
    except Exception:
        return None
