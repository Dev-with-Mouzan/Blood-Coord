from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class DonorRequestCreate(BaseModel):
    blood_request_public_id: str
    donor_public_id: str


class DonorRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    public_id: str
    blood_request_public_id: str
    requester_public_id: str
    donor_public_id: str
    blood_type: str
    hospital: str
    address: str
    units_needed: int
    urgency: str
    status: Literal["PENDING", "ACCEPTED", "REJECTED"]
    requester_name: str
    created_at: datetime


class DonorRequestAction(BaseModel):
    status: Literal["ACCEPTED", "REJECTED"]
