# WebSocket + REST chat endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.blood_request import get_blood_request_by_public_id
from app.crud.chat import (
    create_message,
    get_messages_for_thread,
    get_or_create_thread,
    get_thread_by_public_id,
)
from app.crud.donor import get_donor_by_public_id
from app.crud.requester import get_requester_by_public_id
from app.dependencies import get_current_donor_or_requester
from app.schemas.chat import ChatThreadCreate, ChatThreadOut, MessageCreate, MessageOut

router = APIRouter(prefix="/chat", tags=["chat"])


def _check_participant(thread, role, user):
    if role == "donor" and thread.donor_id == user.id:
        return
    if role == "requester" and thread.requester_id == user.id:
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a participant in this thread")


@router.post("/threads", response_model=ChatThreadOut, status_code=status.HTTP_201_CREATED)
def create_thread(
    payload: ChatThreadCreate,
    auth=Depends(get_current_donor_or_requester),
    db: Session = Depends(get_db),
):
    role, user = auth

    blood_request = get_blood_request_by_public_id(db, payload.request_public_id)
    if blood_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blood request not found")

    if role == "requester":
        if blood_request.requester_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your blood request")

        if not payload.donor_public_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="donor_public_id required")

        donor = get_donor_by_public_id(db, payload.donor_public_id)
        if donor is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found")

        thread = get_or_create_thread(db, donor.id, user.id, blood_request.id)

    elif role == "donor":
        # donor-initiated: they are the donor, requester comes from the blood_request itself
        thread = get_or_create_thread(db, user.id, blood_request.requester_id, blood_request.id)

    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid role")

    return thread


@router.post("/threads/{thread_public_id}/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    thread_public_id: str,
    payload: MessageCreate,
    auth=Depends(get_current_donor_or_requester),
    db: Session = Depends(get_db),
):
    role, user = auth
    thread = get_thread_by_public_id(db, thread_public_id)
    if thread is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    _check_participant(thread, role, user)

    message = create_message(db, thread.id, role, payload.content)
    return message


@router.get("/threads/{thread_public_id}/messages", response_model=list[MessageOut])
def read_messages(
    thread_public_id: str,
    auth=Depends(get_current_donor_or_requester),
    db: Session = Depends(get_db),
):
    role, user = auth
    thread = get_thread_by_public_id(db, thread_public_id)
    if thread is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    _check_participant(thread, role, user)

    return get_messages_for_thread(db, thread.id)