import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy import String as GenericString

from app.core.database import Base, engine


def _uuid_column():
    if engine.dialect.name == "postgresql":
        return Column(PG_UUID(as_uuid=True), unique=True, default=uuid.uuid4, index=True)
    return Column(GenericString(36), unique=True, default=lambda: str(uuid.uuid4()), index=True)


class DonorRequest(Base):
    __tablename__ = "donor_requests"
    __table_args__ = (
        UniqueConstraint("donor_id", "blood_request_id", name="uq_donor_blood_request"),
    )

    id = Column(Integer, primary_key=True, index=True)
    public_id = _uuid_column()

    blood_request_id = Column(Integer, ForeignKey("blood_requests.id"), nullable=False, index=True)
    requester_id = Column(Integer, ForeignKey("requesters.id"), nullable=False, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=False, index=True)

    status = Column(String, nullable=False, default="PENDING", index=True)  # PENDING | ACCEPTED | REJECTED

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    blood_request = relationship("BloodRequest")
    requester = relationship("Requester")
    donor = relationship("Donor")

    @property
    def requester_public_id(self) -> str:
        return str(self.requester.public_id) if self.requester else ""

    @property
    def donor_public_id(self) -> str:
        return str(self.donor.public_id) if self.donor else ""

    @property
    def blood_request_public_id(self) -> str:
        return str(self.blood_request.public_id) if self.blood_request else ""
