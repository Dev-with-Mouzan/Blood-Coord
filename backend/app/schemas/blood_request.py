# Pydantic schemas for BloodRequest

from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import BloodGroup, BloodRequestStatus, UrgencyLevel


class BloodRequestCreate(BaseModel):
    blood_type: BloodGroup
    address: str = Field(..., min_length=3, max_length=255)
    hospital: str = Field(..., min_length=2, max_length=150)
    units_needed: int = Field(1, ge=1, le=50)
    urgency: UrgencyLevel = Field(default=UrgencyLevel.NORMAL)
    patient_context: Optional[str] = Field(None, max_length=500)


class BloodRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: UUID | str
    requester_public_id: UUID | str
    blood_type: BloodGroup
    address: str
    hospital: str
    units_needed: int
    urgency: UrgencyLevel
    patient_context: Optional[str] = None
    status: BloodRequestStatus
    created_at: datetime
    updated_at: datetime


class BloodRequestStatusUpdate(BaseModel):
    status: Literal["PENDING", "FULFILLED", "CLOSED"]
