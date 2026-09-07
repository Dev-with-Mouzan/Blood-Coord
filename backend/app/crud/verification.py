import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.verification import PhoneVerification

OTP_EXPIRY_MINUTES = 10


def generate_otp(db: Session, user_type: str, phone_number: str) -> str:
    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

    record = PhoneVerification(
        user_type=user_type,
        phone_number=phone_number,
        otp_code=otp_code,
        expires_at=expires_at,
        verified=False,
    )
    db.add(record)
    db.commit()
    return otp_code


def verify_otp(db: Session, user_type: str, phone_number: str, otp_code: str) -> bool:
    record = (
        db.query(PhoneVerification)
        .filter(
            PhoneVerification.user_type == user_type,
            PhoneVerification.phone_number == phone_number,
            PhoneVerification.otp_code == otp_code,
            PhoneVerification.verified == False,  # noqa: E712
        )
        .order_by(PhoneVerification.id.desc())
        .first()
    )

    if record is None:
        return False

    if record.expires_at < datetime.utcnow():
        return False

    record.verified = True
    db.commit()
    return True