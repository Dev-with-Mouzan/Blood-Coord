from typing import Literal

from pydantic import BaseModel, Field


class SendOtpRequest(BaseModel):
    role: Literal["donor", "requester"]
    phone_number: str


class VerifyOtpRequest(BaseModel):
    role: Literal["donor", "requester"]
    phone_number: str
    otp_code: str = Field(..., min_length=4, max_length=8)