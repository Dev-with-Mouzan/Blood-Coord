# Pydantic schemas for Donor

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DonorSignup(BaseModel):
    name: str
    age: int = Field(..., ge=18, le=65)
    gender: str
    blood_group: str
    phone_number: str
    address: str
    password: str = Field(..., min_length=8)
    weight: Optional[float] = None
    health_status: Optional[str] = None
    last_donation_date: Optional[date] = None


class DonorLogin(BaseModel):
    phone_number: str
    password: str


class DonorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: str
    name: str
    age: int
    gender: str
    blood_group: str
    address: str
    weight: Optional[float] = None
    health_status: Optional[str] = None
    last_donation_date: Optional[date] = None
    available_to_donate: bool
    eligible_status: bool
    # NOTE: phone_number is deliberately excluded from DonorOut —
    # never expose it through general read endpoints.


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
