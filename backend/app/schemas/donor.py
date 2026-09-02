# Pydantic schemas for Donor

from datetime import date, timedelta
from typing import Optional

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, computed_field

from app.schemas.enums import BloodGroup
from app.schemas.token import Token

PHONE_REGEX = r"^\+?[1-9]\d{7,14}$"

DONATION_COOLDOWN_DAYS = 120


class DonorSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=18, le=65)
    gender: str = Field(..., min_length=1, max_length=20)
    blood_group: BloodGroup
    phone_number: str = Field(..., pattern=PHONE_REGEX)
    address: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8, max_length=72)
    weight: Optional[float] = Field(None, ge=30.0, le=300.0)
    health_status: Optional[str] = Field(None, max_length=255)
    last_donation_date: Optional[date] = None


class DonorLogin(BaseModel):
    phone_number: str = Field(..., pattern=PHONE_REGEX)
    password: str = Field(..., min_length=1)


class DonorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: UUID | str
    name: str
    age: int
    gender: str
    blood_group: BloodGroup
    address: str
    weight: Optional[float] = None
    health_status: Optional[str] = None
    last_donation_date: Optional[date] = None
    eligible_status: bool
    # NOTE: phone_number is deliberately excluded from DonorOut —
    # never expose it through general read endpoints.

    @computed_field
    @property
    def available_to_donate(self) -> bool:
        if self.last_donation_date is None:
            return True
        cooldown_cutoff = date.today() - timedelta(days=DONATION_COOLDOWN_DAYS)
        return self.last_donation_date <= cooldown_cutoff