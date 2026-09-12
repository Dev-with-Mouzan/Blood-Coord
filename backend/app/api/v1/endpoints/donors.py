# donor CRUD/profile

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.dependencies import get_current_donor
from app.models.donor import Donor
from app.models.notification import Notification
from app.schemas.donor import DonorOut
from app.schemas.notification import NotificationOut

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.matching import find_matching_requests_for_donor
from app.schemas.blood_request import BloodRequestOut  # reuse existing schema

router = APIRouter(prefix="/donors", tags=["donors"])


class DonorUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    age: int | None = Field(None, ge=16, le=100)
    gender: str | None = Field(None, pattern="^(male|female|other)$")
    address: str | None = Field(None, min_length=3, max_length=500)
    weight: float | None = Field(None, ge=30, le=300)
    health_status: str | None = Field(None, max_length=200)
    available_to_donate: bool | None = None


@router.get("/me", response_model=DonorOut)
def read_my_profile(current_donor: Donor = Depends(get_current_donor)):
    return current_donor


@router.patch("/me", response_model=DonorOut)
def update_my_profile(
    payload: DonorUpdate,
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_donor, key, value)
    db.commit()
    db.refresh(current_donor)
    return current_donor


@router.get("/me/notifications", response_model=list[NotificationOut])
def get_my_notifications(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    return (
        db.query(Notification)
        .filter(Notification.donor_id == current_donor.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )


@router.get("/me/notifications/unread-count")
def get_unread_count(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    count = (
        db.query(Notification)
        .filter(Notification.donor_id == current_donor.id, Notification.is_read == False)
        .count()
    )
    return {"count": count}


@router.patch("/me/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    notif = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.donor_id == current_donor.id)
        .first()
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"ok": True}


@router.post("/me/notifications/read-all")
def mark_all_read(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    db.query(Notification).filter(
        Notification.donor_id == current_donor.id, Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"ok": True}


@router.get("/me/matching-requests", response_model=list[BloodRequestOut])
def get_my_matching_requests(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    return find_matching_requests_for_donor(db, current_donor)