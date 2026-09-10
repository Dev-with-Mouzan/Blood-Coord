# create/view blood requests

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.blood_request import create_blood_request, get_blood_requests_by_requester, update_request_status
from app.crud.chat import get_threads_for_request, create_message
from app.dependencies import get_current_requester
from app.models.requester import Requester
from app.models.donor import Donor
from app.models.notification import Notification
from app.schemas.blood_request import BloodRequestCreate, BloodRequestOut, BloodRequestStatusUpdate

from fastapi import HTTPException, status  

from app.services.matching import find_matching_donors, BLOOD_COMPATIBILITY
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


@router.get("/{request_public_id}/available-donors")
def get_available_donors(
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
            detail="Not authorized to view donors for this request",
        )

    # Get all matching donors
    all_donors = find_matching_donors(db, blood_request)
    
    # Separate into exact match and compatible
    exact_match = []
    compatible = []
    
    for donor in all_donors:
        donor_dict = {
            "public_id": str(donor.public_id),
            "name": donor.name,
            "blood_group": donor.blood_group,
            "address": donor.address or "",
            "eligible_status": donor.eligible_status,
            "available_to_donate": donor.available_to_donate,
        }
        if donor.blood_group == blood_request.blood_type:
            exact_match.append(donor_dict)
        else:
            compatible.append(donor_dict)
    
    return {
        "exact_match": exact_match,
        "compatible": compatible,
        "request_blood_type": blood_request.blood_type,
    }


@router.post("/{request_public_id}/notify-donors")
def notify_selected_donors(
    request_public_id: str,
    payload: dict,
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
            detail="Not authorized to notify donors for this request",
        )

    donor_public_ids = payload.get("donor_public_ids", [])
    if not donor_public_ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No donors selected")

    # Find donors and create notifications
    donors = db.query(Donor).filter(Donor.public_id.in_(donor_public_ids)).all()
    
    urgency_label = " urgently" if blood_request.urgency in ("CRITICAL", "URGENT") else ""
    for donor in donors:
        notif = Notification(
            donor_id=donor.id,
            title=f"New blood request{urgency_label}",
            message=f"{blood_request.hospital} needs {blood_request.units_needed} unit(s) of {blood_request.blood_type} blood",
            type="request",
            blood_request_id=blood_request.id,
        )
        db.add(notif)
    
    db.commit()
    return {"notified": len(donors)}


@router.patch("/{request_public_id}/status", response_model=BloodRequestOut)  # reuse existing BloodRequestOut schema
def update_status(
    request_public_id: str,
    payload: BloodRequestStatusUpdate,
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
            detail="Not authorized to update this request",
        )

    updated = update_request_status(db, blood_request, payload.status)

    # Auto-broadcast closure/fulfillment to every chat thread tied to this request
    if payload.status in ("FULFILLED", "CLOSED"):
        threads = get_threads_for_request(db, blood_request.id)
        broadcast_text = (
            "This blood request has been fulfilled. Thank you for your help!"
            if payload.status == "FULFILLED"
            else "This blood request has been closed."
        )
        for thread in threads:
            create_message(db, thread.id, "system", broadcast_text)

    return updated