# FastAPI app entrypoint

from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.database import Base, engine
from app.models import donor  # noqa: F401  (ensures model is registered before create_all)
from app.models import requester
from app.models import blood_request
from app.models import chat

# For the prototype we create tables directly on startup.
# Once Alembic migrations are set up (Phase 1 task), remove this and use
# `alembic upgrade head` instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blood Coord API", version="0.1.0")

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok"}
