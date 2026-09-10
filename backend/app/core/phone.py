# Shared phone-number handling for Pakistan (+92) numbers.

import re

COUNTRY_CODE = "92"

# Stored/canonical form: +92 followed by the national number, 10 digits minimum.
PHONE_REGEX = r"^\+92\d{10,}$"


def normalize_phone(phone: str) -> str:
    """Canonicalize any input to +92XXXXXXXXXX (min 10 digits after +92).

    Accepts leading-zero national form (03001234567), bare national form
    (3001234567), and already-canonical input (+923001234567).
    """
    digits = re.sub(r"\D", "", phone)
    if digits.startswith(COUNTRY_CODE):
        digits = digits[len(COUNTRY_CODE):]
    elif digits.startswith("0"):
        digits = digits[1:]
    return f"+92{digits}"


def phone_variants(phone: str) -> list[str]:
    """Candidate stored forms for a DB lookup: canonical +92 form plus the
    legacy formats already in the database (leading-zero and bare national).
    """
    normalized = normalize_phone(phone)
    national = normalized[len(COUNTRY_CODE) + 1:]
    return [normalized, f"0{national}", national]
