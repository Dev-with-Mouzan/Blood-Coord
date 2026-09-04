# Chat/message model, linked by public_id (no phone exposed)

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String as GenericString
from sqlalchemy.orm import relationship

from app.core.database import Base, engine


def _uuid_column():
    if engine.dialect.name == "postgresql":
        return Column(PG_UUID(as_uuid=True), unique=True, default=uuid.uuid4, index=True)
    return Column(GenericString(36), unique=True, default=lambda: str(uuid.uuid4()), index=True)


class ChatThread(Base):
    __tablename__ = "chat_threads"
    __table_args__ = (
        UniqueConstraint("donor_id", "requester_id", "blood_request_id", name="uq_thread_participants"),
    )

    id = Column(Integer, primary_key=True, index=True)
    public_id = _uuid_column()

    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("requesters.id"), nullable=False)
    blood_request_id = Column(Integer, ForeignKey("blood_requests.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("Message", back_populates="thread", order_by="Message.created_at")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("chat_threads.id"), nullable=False)

    sender_role = Column(String, nullable=False)  # "donor" or "requester"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    thread = relationship("ChatThread", back_populates="messages")