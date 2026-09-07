from fastapi import APIRouter

from app.api.v1.endpoints import auth, donors, requester_auth, requesters, requests, chat

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(donors.router)
api_router.include_router(requester_auth.router)
api_router.include_router(requesters.router)
api_router.include_router(requests.router)
api_router.include_router(chat.router)