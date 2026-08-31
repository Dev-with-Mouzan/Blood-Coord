from enum import Enum


class BloodGroup(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"


class UrgencyLevel(str, Enum):
    CRITICAL = "CRITICAL"
    URGENT = "URGENT"
    NORMAL = "NORMAL"


class BloodRequestStatus(str, Enum):
    PENDING = "PENDING"
    MATCHING = "MATCHING"
    FULFILLED = "FULFILLED"
    CLOSED = "CLOSED"
