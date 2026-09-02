# create/view blood requests

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.blood_request import create_blood_request, get_blood_requests_by_requester
from app.dependencies import get_current_requester
from app.models.requester import Requester
from app.schemas.blood_request import BloodRequestCreate, BloodRequestOut

from fastapi import HTTPException, status  

from app.services.matching import find_matching_donors
from app.schemas.donor import DonorOut
from app.models.blood_request import BloodRequest


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


@router.get("/{request_public_id}/matches", response_model=list[DonorOut])
def get_matches_for_request(
    request_public_id: str,
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    blood_request = db.query(BloodRequest).filter(
        BloodRequest.public_id == request_public_id
    ).first()

    if blood_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    if blood_request.requester_id != current_requester.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view matches for this request",
        )

    return find_matching_donors(db, blood_request)

