"""Simple in-memory rate limiter for auth endpoints."""

import time
from collections import defaultdict
from fastapi import HTTPException, status

# Store: {ip: [timestamp, timestamp, ...]}
_login_attempts: dict[str, list[float]] = defaultdict(list)

MAX_ATTEMPTS = 5
WINDOW_SECONDS = 300  # 5 minutes


def check_rate_limit(ip: str) -> None:
    """Raise 429 if too many login attempts from this IP."""
    now = time.time()
    # Remove old attempts outside the window
    _login_attempts[ip] = [
        t for t in _login_attempts[ip] if now - t < WINDOW_SECONDS
    ]
    if len(_login_attempts[ip]) >= MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Try again in 5 minutes.",
        )
    _login_attempts[ip].append(now)


def reset_rate_limit(ip: str) -> None:
    """Clear rate limit after successful login."""
    _login_attempts.pop(ip, None)
