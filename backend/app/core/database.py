# SQLAlchemy engine/session

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# check_same_thread only needed for sqlite; harmless to set conditionally
connect_args = (
    {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

# Remote Postgres providers (e.g. Neon) close idle SSL connections server-side,
# which surfaces as "SSL connection has been closed unexpectedly" when a stale
# pooled connection is reused. pool_pre_ping validates each checkout and
# transparently reconnects; pool_recycle bounds connection age as a backstop.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=280,
    pool_size=5,
    max_overflow=5,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
