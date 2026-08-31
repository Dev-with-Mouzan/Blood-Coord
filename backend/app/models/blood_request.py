import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy import String as GenericString

from app.core.database import Base, engine


def _uuid_column():
    if engine.dialect.name == "postgresql":
        return Column(PG_UUID(as_uuid=True), unique=True, default=uuid.uuid4, index=True)
    return Column(GenericString(36), unique=True, default=lambda: str(uuid.uuid4()), index=True)


class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(Integer, primary_key=True, index=True)
    public_id = _uuid_column()

    requester_id = Column(Integer, ForeignKey("requesters.id"), nullable=False, index=True)

    blood_type = Column(String, nullable=False, index=True)
    address = Column(String, nullable=False)
    hospital = Column(String, nullable=False)
    units_needed = Column(Integer, nullable=False, default=1)
    urgency = Column(String, nullable=False, default="NORMAL")
    patient_context = Column(String, nullable=True)
    status = Column(String, nullable=False, default="PENDING", index=True)

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    requester = relationship("Requester", back_populates="blood_requests")

    @property
    def requester_public_id(self) -> str:
        return str(self.requester.public_id) if self.requester else ""

