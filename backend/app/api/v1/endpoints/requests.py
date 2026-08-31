# create/view blood requests

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.blood_request import create_blood_request, get_blood_requests_by_requester
from app.dependencies import get_current_requester
from app.models.requester import Requester
from app.schemas.blood_request import BloodRequestCreate, BloodRequestOut

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("", response_model=BloodRequestOut, status_code=status.HTTP_201_CREATED)
def submit_blood_request(
    request_in: BloodRequestCreate,
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    blood_request = create_blood_request(db, request_in, current_requester.id)
    return blood_request


@router.get("/me", response_model=list[BloodRequestOut])
def read_my_blood_requests(
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    return get_blood_requests_by_requester(db, current_requester.id)
