# Pydantic schemas for Chat

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ChatThreadCreate(BaseModel):
    donor_public_id: Optional[str] = None
    request_public_id: str


class ChatThreadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: UUID | str
    created_at: datetime


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sender_role: str
    content: str
    created_at: datetime