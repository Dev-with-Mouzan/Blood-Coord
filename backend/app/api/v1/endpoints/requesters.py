# requester CRUD

from fastapi import APIRouter, Depends

from app.dependencies import get_current_requester
from app.models.requester import Requester
from app.schemas.requester import RequesterOut

router = APIRouter(prefix="/requesters", tags=["requesters"])


@router.get("/me", response_model=RequesterOut)
def read_my_profile(current_requester: Requester = Depends(get_current_requester)):
    return current_requester