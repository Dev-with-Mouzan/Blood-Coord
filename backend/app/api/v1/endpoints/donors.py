# donor CRUD/profile

from fastapi import APIRouter, Depends

from app.dependencies import get_current_donor
from app.models.donor import Donor
from app.schemas.donor import DonorOut

router = APIRouter(prefix="/donors", tags=["donors"])


@router.get("/me", response_model=DonorOut)
def read_my_profile(current_donor: Donor = Depends(get_current_donor)):
    return current_donor
