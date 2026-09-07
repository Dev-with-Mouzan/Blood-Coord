from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.donor import get_donor_by_phone
from app.crud.requester import get_requester_by_phone
from app.crud.verification import generate_otp, verify_otp
from app.schemas.verification import SendOtpRequest, VerifyOtpRequest
from app.services.sms import send_otp_sms

router = APIRouter(prefix="/verify", tags=["verification"])


@router.post("/send-otp", status_code=status.HTTP_200_OK)
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    if payload.role == "donor":
        user = get_donor_by_phone(db, payload.phone_number)
    else:
        user = get_requester_by_phone(db, payload.phone_number)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    otp_code = generate_otp(db, payload.role, payload.phone_number)
    send_otp_sms(payload.phone_number, otp_code)

    return {"message": "OTP sent"}


@router.post("/confirm-otp", status_code=status.HTTP_200_OK)
def confirm_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    success = verify_otp(db, payload.role, payload.phone_number, payload.otp_code)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP")

    if payload.role == "donor":
        user = get_donor_by_phone(db, payload.phone_number)
    else:
        user = get_requester_by_phone(db, payload.phone_number)

    user.phone_verified = True
    db.commit()

    return {"message": "Phone verified"}