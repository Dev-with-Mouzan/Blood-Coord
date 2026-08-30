# Blood Bank Platform — Backend (Prototype Slice 1)

This is a working, tested slice: **donor signup → donor login → view own profile**.
Uses SQLite by default so you can run it immediately with zero setup — switch to
Postgres later by changing `DATABASE_URL` in `.env`.

## Run it

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # edit SECRET_KEY at minimum

uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs — FastAPI's auto-generated interactive API docs.
You can test signup/login directly from that page without writing any client code.

## Try it with curl

```bash
# Signup
curl -X POST http://127.0.0.1:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Donor",
    "age": 22,
    "gender": "male",
    "blood_group": "O+",
    "phone_number": "03001234567",
    "address": "Hostel 3, University of Haripur",
    "password": "testpass123"
  }'

# Login (note: form-encoded, not JSON — this is FastAPI's OAuth2 standard)
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=03001234567&password=testpass123"

# Use the access_token from the login response:
curl http://127.0.0.1:8000/api/v1/donors/me \
  -H "Authorization: Bearer <access_token>"
```

## What's implemented

- `POST /api/v1/auth/signup` — donor registration
- `POST /api/v1/auth/login` — returns a JWT (uses `username` field for phone number, per OAuth2 form spec)
- `GET /api/v1/donors/me` — protected route, requires the JWT
- `GET /health` — basic health check

Notice `DonorOut` (in `app/schemas/donor.py`) deliberately never includes `phone_number`.
Every donor also gets a `public_id` (UUID) — **always reference donors by `public_id`
in any future feature** (chat, search results, matching), never by phone number or
internal DB id. This is the privacy pattern the whole platform should follow.

## What's NOT implemented yet (intentionally, for this slice)

- Requester signup/login (same pattern as donor — copy `models/donor.py`,
  `schemas/donor.py`, `crud/donor.py`, `endpoints/auth.py` and adapt)
- Blood request creation
- Search/matching engine
- Chat between donor and requester
- Alembic migrations (tables are currently created via `Base.metadata.create_all`
  on startup — fine for a prototype, replace with real migrations before this
  touches a shared/production database)

## Next steps (suggested order)

1. Copy the donor pattern to build `Requester` signup/login.
2. Add `BloodRequest` model + `POST /api/v1/requests` (requester creates a request).
3. Build `services/matching.py` — simple SQL filter: blood-group compatible +
   `eligible_status=True` + same address/area string match. No AI needed yet.
4. Add `GET /api/v1/search` — returns matched donors for a request (by `public_id`
   only, never phone number).
5. Only once 1–4 work: add chat (`models/chat.py`, WebSocket endpoint) so a
   requester and matched donor can talk without either seeing the other's number.

Each of these steps should be small enough to build and test in isolation the same
way this slice was — get one working, verify with curl or `/docs`, then move on.
