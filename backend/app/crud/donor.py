import uuid

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.donor import Donor
from app.schemas.donor import DonorSignup


def get_donor_by_phone(db: Session, phone_number: str) -> Donor | None:
    return db.query(Donor).filter(Donor.phone_number == phone_number).first()


def get_donor_by_public_id(db: Session, public_id: str | uuid.UUID) -> Donor | None:
    str_val = str(public_id)
    try:
        donor = db.query(Donor).filter(Donor.public_id == str_val).first()
        if donor is not None:
            return donor
    except Exception:
        pass

    try:
        uuid_val = uuid.UUID(str_val) if not isinstance(public_id, uuid.UUID) else public_id
        return db.query(Donor).filter(Donor.public_id == uuid_val).first()
    except Exception:
        return None


def create_donor(db: Session, donor_in: DonorSignup) -> Donor:
    donor = Donor(
        name=donor_in.name,
        age=donor_in.age,
        gender=donor_in.gender,
        blood_group=donor_in.blood_group,
        phone_number=donor_in.phone_number,
        address=donor_in.address,
        hashed_password=hash_password(donor_in.password),
        weight=donor_in.weight,
        health_status=donor_in.health_status,
        last_donation_date=donor_in.last_donation_date,
    )
    db.add(donor)
    db.commit()
    db.refresh(donor)
    return donor
