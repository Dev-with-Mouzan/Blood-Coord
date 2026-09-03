# search-system logic (blood group, eligible, location)

from datetime import date, timedelta

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.donor import Donor
from app.models.blood_request import BloodRequest

DONATION_COOLDOWN_DAYS = 120

BLOOD_COMPATIBILITY: dict[str, list[str]] = {
    "O-":  ["O-"],
    "O+":  ["O-", "O+"],
    "A-":  ["O-", "A-"],
    "A+":  ["O-", "O+", "A-", "A+"],
    "B-":  ["O-", "B-"],
    "B+":  ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
}


def find_matching_donors(db: Session, blood_request: BloodRequest) -> list[Donor]:
    compatible_groups = BLOOD_COMPATIBILITY.get(blood_request.blood_type, [])
    if not compatible_groups:
        return []

    cooldown_cutoff = date.today() - timedelta(days=DONATION_COOLDOWN_DAYS)

    query = db.query(Donor).filter(
        Donor.blood_group.in_(compatible_groups),
        Donor.eligible_status == True,  # noqa: E712
        Donor.available_to_donate == True,  # noqa: E712
        or_(
            Donor.last_donation_date == None,  # noqa: E711  never donated
            Donor.last_donation_date <= cooldown_cutoff,
        ),
    )

    donors = query.all()

    # Simple location filter: prefer donors whose address contains a shared
    # keyword with the request address. For prototype, this just re-orders
    # rather than excludes, so no one is wrongly filtered out by weak string
    # matching yet.

    if blood_request.address:
        request_keywords = set(blood_request.address.lower().split())

        def location_score(donor: Donor) -> int:
            donor_keywords = set((donor.address or "").lower().split())
            return len(request_keywords & donor_keywords)

        donors.sort(key=location_score, reverse=True)

    return donors
