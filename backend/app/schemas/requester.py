# Pydantic schemas for Requester

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

PHONE_REGEX = r"^\+?[1-9]\d{7,14}$"


class RequesterSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., pattern=PHONE_REGEX)
    address: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8, max_length=72)


class RequesterLogin(BaseModel):
    phone_number: str = Field(..., pattern=PHONE_REGEX)
    password: str = Field(..., min_length=1)


class RequesterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: UUID | str
    name: str
    address: str
    # phone_number deliberately excluded — never expose it