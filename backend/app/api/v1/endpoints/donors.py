# donor CRUD/profile

from fastapi import APIRouter, Depends

from app.dependencies import get_current_donor
from app.models.donor import Donor
from app.schemas.donor import DonorOut

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.matching import find_matching_requests_for_donor
from app.schemas.blood_request import BloodRequestOut  # reuse existing schema

router = APIRouter(prefix="/donors", tags=["donors"])


@router.get("/me", response_model=DonorOut)
def read_my_profile(current_donor: Donor = Depends(get_current_donor)):
    return current_donor


@router.patch("/me", response_model=DonorOut)
def update_my_profile(
    payload: dict,
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    allowed_fields = {
        "name", "age", "gender", "address", "weight",
        "health_status", "available_to_donate",
    }
    for key, value in payload.items():
        if key in allowed_fields:
            setattr(current_donor, key, value)
    db.commit()
    db.refresh(current_donor)
    return current_donor


@router.get("/me/matching-requests", response_model=list[BloodRequestOut])
def get_my_matching_requests(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    return find_matching_requests_for_donor(db, current_donor)