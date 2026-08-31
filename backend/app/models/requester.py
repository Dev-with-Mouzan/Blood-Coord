# Requester model: name, phone, address

import uuid

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy import String as GenericString

from app.core.database import Base, engine


def _uuid_column():
    if engine.dialect.name == "postgresql":
        return Column(PG_UUID(as_uuid=True), unique=True, default=uuid.uuid4, index=True)
    return Column(GenericString(36), unique=True, default=lambda: str(uuid.uuid4()), index=True)


class Requester(Base):
    __tablename__ = "requesters"

    id = Column(Integer, primary_key=True, index=True)
    public_id = _uuid_column()

    name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=False, index=True)
    address = Column(String, nullable=False)

    hashed_password = Column(String, nullable=False)
    phone_verified = Column(Boolean, default=False)

    blood_requests = relationship("BloodRequest", back_populates="requester")