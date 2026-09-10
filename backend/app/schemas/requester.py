# Pydantic schemas for Requester

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.phone import PHONE_REGEX, normalize_phone


class RequesterSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., pattern=PHONE_REGEX)
    address: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8, max_length=72)


class RequesterLogin(BaseModel):
    phone_number: str
    password: str = Field(..., min_length=1)

    @field_validator("phone_number")
    @classmethod
    def _normalize_phone(cls, v: str) -> str:
        return normalize_phone(v)


class RequesterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: UUID | str
    name: str
    address: str
    # phone_number deliberately excluded — never expose it