from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_donor, get_current_requester
from app.crud.donor_request import (
    create_donor_request,
    get_incoming_requests_for_donor,
    get_accepted_requests_for_donor,
    get_connections_for_requester,
    get_donor_request_by_public_id,
    update_donor_request_status,
)
from app.crud.blood_request import get_blood_request_by_public_id
from app.crud.donor import get_donor_by_public_id
from app.crud.chat import get_or_create_thread
from app.models.donor import Donor
from app.models.requester import Requester
from app.schemas.donor_request import DonorRequestOut

router = APIRouter(prefix="/donor-requests", tags=["donor-requests"])


def _to_out(dr) -> DonorRequestOut:
    return DonorRequestOut(
        id=dr.id,
        public_id=str(dr.public_id),
        blood_request_public_id=str(dr.blood_request.public_id) if dr.blood_request else "",
        requester_public_id=str(dr.requester.public_id) if dr.requester else "",
        donor_public_id=str(dr.donor.public_id) if dr.donor else "",
        blood_type=dr.blood_request.blood_type if dr.blood_request else "",
        hospital=dr.blood_request.hospital if dr.blood_request else "",
        address=dr.blood_request.address if dr.blood_request else "",
        units_needed=dr.blood_request.units_needed if dr.blood_request else 1,
        urgency=dr.blood_request.urgency if dr.blood_request else "NORMAL",
        status=dr.status,
        requester_name=dr.requester.name if dr.requester else "",
        created_at=dr.created_at,
    )


@router.post("", response_model=DonorRequestOut, status_code=status.HTTP_201_CREATED)
def send_request(
    blood_request_public_id: str,
    donor_public_id: str,
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    blood_request = get_blood_request_by_public_id(db, blood_request_public_id)
    if not blood_request:
        raise HTTPException(status_code=404, detail="Blood request not found")
    if blood_request.requester_id != current_requester.id:
        raise HTTPException(status_code=403, detail="Not your blood request")

    donor = get_donor_by_public_id(db, donor_public_id)
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")

    donor_request = create_donor_request(db, blood_request.id, current_requester.id, donor.id)
    return _to_out(donor_request)


@router.get("/incoming", response_model=list[DonorRequestOut])
def list_incoming_requests(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    requests = get_incoming_requests_for_donor(db, current_donor.id)
    return [_to_out(r) for r in requests]


@router.get("/accepted", response_model=list[DonorRequestOut])
def list_accepted_requests(
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    requests = get_accepted_requests_for_donor(db, current_donor.id)
    return [_to_out(r) for r in requests]


@router.get("/connections", response_model=list[DonorRequestOut])
def list_connections(
    current_requester: Requester = Depends(get_current_requester),
    db: Session = Depends(get_db),
):
    connections = get_connections_for_requester(db, current_requester.id)
    return [_to_out(c) for c in connections]


@router.patch("/{donor_request_public_id}/accept", response_model=DonorRequestOut)
def accept_request(
    donor_request_public_id: str,
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    donor_request = get_donor_request_by_public_id(db, donor_request_public_id)
    if not donor_request:
        raise HTTPException(status_code=404, detail="Request not found")
    if donor_request.donor_id != current_donor.id:
        raise HTTPException(status_code=403, detail="Not your request")
    if donor_request.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request already processed")

    update_donor_request_status(db, donor_request, "ACCEPTED")

    get_or_create_thread(
        db,
        donor_id=current_donor.id,
        requester_id=donor_request.requester_id,
        blood_request_id=donor_request.blood_request_id,
    )

    return _to_out(donor_request)


@router.patch("/{donor_request_public_id}/reject", response_model=DonorRequestOut)
def reject_request(
    donor_request_public_id: str,
    current_donor: Donor = Depends(get_current_donor),
    db: Session = Depends(get_db),
):
    donor_request = get_donor_request_by_public_id(db, donor_request_public_id)
    if not donor_request:
        raise HTTPException(status_code=404, detail="Request not found")
    if donor_request.donor_id != current_donor.id:
        raise HTTPException(status_code=403, detail="Not your request")
    if donor_request.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request already processed")

    update_donor_request_status(db, donor_request, "REJECTED")
    return _to_out(donor_request)
