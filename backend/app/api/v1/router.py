# aggregates all v1 routes

from fastapi import APIRouter

from app.api.v1.endpoints import auth, donors

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(donors.router)
