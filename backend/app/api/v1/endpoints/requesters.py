# requester CRUD

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.database import get_db
from app.dependencies import get_current_requester
from app.models.notification import Notification
from app.models.requester import Requester
from app.schemas.requester import RequesterOut

from sqlalchemy.orm import Session

router = APIRouter(prefix="/requesters", tags=["requesters"])


class RequesterUpdate(BaseModel):
    name: str | None = None
    address: str | None = None


@router.get("/me", response_model=RequesterOut)
def read_my_profile(current_requester: Requester = Depends(get_current_requester)):
    return current_requester


@router.patch("/me", response_model=RequesterOut)
def update_my_profile(
    payload: RequesterUpdate,
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    if payload.name is not None:
        current_requester.name = payload.name
    if payload.address is not None:
        current_requester.address = payload.address
    db.commit()
    db.refresh(current_requester)
    return current_requester


@router.get("/me/notifications")
def get_my_notifications(
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    return (
        db.query(Notification)
        .filter(Notification.requester_id == current_requester.id)
        .order_by(Notification.created_at.desc())
        .limit(20)
        .all()
    )


@router.get("/me/notifications/unread-count")
def get_unread_count(
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    count = (
        db.query(Notification)
        .filter(
            Notification.requester_id == current_requester.id,
            Notification.is_read == False,
        )
        .count()
    )
    return {"count": count}


@router.patch("/me/notifications/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    notif = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.requester_id == current_requester.id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"ok": True}


@router.post("/me/notifications/read-all")
def mark_all_read(
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    db.query(Notification).filter(
        Notification.requester_id == current_requester.id, Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"ok": True}
