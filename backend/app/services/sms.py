import logging

logger = logging.getLogger("sms")


def send_otp_sms(phone_number: str, otp_code: str) -> None:
    """
    MOCK sender — prints/logs the OTP instead of sending a real SMS.
    Replace this function's body with a real Twilio/WhatsApp Business API
    call later. Nothing else in the codebase needs to change.
    """
    logger.info(f"[MOCK SMS] To: {phone_number} | OTP: {otp_code}")
    print(f"[MOCK SMS] To: {phone_number} | OTP: {otp_code}")