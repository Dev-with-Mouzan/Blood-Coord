import uuid

from sqlalchemy.orm import Session

from app.models.donor_request import DonorRequest
from app.models.blood_request import BloodRequest
from app.models.donor import Donor
from app.models.requester import Requester


def create_donor_request(
    db: Session, blood_request_id: int, requester_id: int, donor_id: int
) -> DonorRequest:
    existing = (
        db.query(DonorRequest)
        .filter(
            DonorRequest.donor_id == donor_id,
            DonorRequest.blood_request_id == blood_request_id,
        )
        .first()
    )
    if existing:
        return existing

    donor_request = DonorRequest(
        blood_request_id=blood_request_id,
        requester_id=requester_id,
        donor_id=donor_id,
        status="PENDING",
    )
    db.add(donor_request)
    db.commit()
    db.refresh(donor_request)
    return donor_request


def get_incoming_requests_for_donor(db: Session, donor_id: int) -> list[DonorRequest]:
    return (
        db.query(DonorRequest)
        .filter(DonorRequest.donor_id == donor_id, DonorRequest.status == "PENDING")
        .order_by(DonorRequest.created_at.desc())
        .all()
    )


def get_accepted_requests_for_donor(db: Session, donor_id: int) -> list[DonorRequest]:
    return (
        db.query(DonorRequest)
        .filter(DonorRequest.donor_id == donor_id, DonorRequest.status == "ACCEPTED")
        .order_by(DonorRequest.created_at.desc())
        .all()
    )


def get_connections_for_requester(db: Session, requester_id: int) -> list[DonorRequest]:
    return (
        db.query(DonorRequest)
        .filter(DonorRequest.requester_id == requester_id)
        .order_by(DonorRequest.created_at.desc())
        .all()
    )


def get_donor_request_by_public_id(db: Session, public_id: str) -> DonorRequest | None:
    return db.query(DonorRequest).filter(DonorRequest.public_id == public_id).first()


def update_donor_request_status(db: Session, donor_request: DonorRequest, status: str) -> DonorRequest:
    donor_request.status = status
    db.commit()
    db.refresh(donor_request)
    return donor_request


def get_donor_request_by_donor_and_blood_request(
    db: Session, donor_id: int, blood_request_id: int
) -> DonorRequest | None:
    return (
        db.query(DonorRequest)
        .filter(
            DonorRequest.donor_id == donor_id,
            DonorRequest.blood_request_id == blood_request_id,
        )
        .first()
    )


def donor_request_exists(db: Session, donor_id: int, blood_request_id: int) -> bool:
    return (
        db.query(DonorRequest)
        .filter(
            DonorRequest.donor_id == donor_id,
            DonorRequest.blood_request_id == blood_request_id,
        )
        .first()
        is not None
    )
