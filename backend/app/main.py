# FastAPI app entrypoint

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import donor  # noqa: F401  (ensures model is registered before create_all)
from app.models import requester
from app.models import blood_request
from app.models import chat
from app.models import notification
from app.models import donor_request

# For the prototype we create tables directly on startup.
# Once Alembic migrations are set up (Phase 1 task), remove this and use
# `alembic upgrade head` instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blood Coord API", version="0.1.0")


class RequestBodyLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.headers.get("content-length"):
            if int(request.headers["content-length"]) > 1_000_000:  # 1MB limit
                return await request.close()
        return await call_next(request)


app.add_middleware(RequestBodyLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok"}
