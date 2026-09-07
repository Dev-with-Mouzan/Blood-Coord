from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.core.database import Base


class PhoneVerification(Base):
    __tablename__ = "phone_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_type = Column(String, nullable=False)  # "donor" or "requester"
    phone_number = Column(String, nullable=False, index=True)
    otp_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    verified = Column(Boolean, default=False)