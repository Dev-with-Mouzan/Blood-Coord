# Donor model: name, age, gender, blood_group, phone, address,
# last_donation_date, health_status, weight, available, eligible

import uuid

from sqlalchemy import Boolean, Column, Date, Float, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String as GenericString

from app.core.database import Base, engine


def _uuid_column():
    # Uses native UUID on Postgres, falls back to String on SQLite (dev default)
    if engine.dialect.name == "postgresql":
        return Column(PG_UUID(as_uuid=True), unique=True, default=uuid.uuid4, index=True)
    return Column(GenericString(36), unique=True, default=lambda: str(uuid.uuid4()), index=True)


class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    public_id = _uuid_column()  # used everywhere else instead of phone number

    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    blood_group = Column(String, nullable=False, index=True)

    phone_number = Column(String, unique=True, nullable=False, index=True)
    address = Column(String, nullable=False)

    hashed_password = Column(String, nullable=False)

    weight = Column(Float, nullable=True)
    health_status = Column(String, nullable=True)
    last_donation_date = Column(Date, nullable=True)

    available_to_donate = Column(Boolean, default=True)
    eligible_status = Column(Boolean, default=True)
    phone_verified = Column(Boolean, default=False)
