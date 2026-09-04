import uuid

from sqlalchemy.orm import Session

from app.models.chat import ChatThread, Message


def get_or_create_thread(db: Session, donor_id: int, requester_id: int, blood_request_id: int) -> ChatThread:
    thread = (
        db.query(ChatThread)
        .filter(
            ChatThread.donor_id == donor_id,
            ChatThread.requester_id == requester_id,
            ChatThread.blood_request_id == blood_request_id,
        )
        .first()
    )
    if thread:
        return thread

    thread = ChatThread(donor_id=donor_id, requester_id=requester_id, blood_request_id=blood_request_id)
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return thread


def get_thread_by_public_id(db: Session, public_id: str | uuid.UUID) -> ChatThread | None:
    str_val = str(public_id)
    try:
        thread = db.query(ChatThread).filter(ChatThread.public_id == str_val).first()
        if thread is not None:
            return thread
    except Exception:
        pass

    try:
        uuid_val = uuid.UUID(str_val) if not isinstance(public_id, uuid.UUID) else public_id
        return db.query(ChatThread).filter(ChatThread.public_id == uuid_val).first()
    except Exception:
        return None


def create_message(db: Session, thread_id: int, sender_role: str, content: str) -> Message:
    message = Message(thread_id=thread_id, sender_role=sender_role, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_messages_for_thread(db: Session, thread_id: int) -> list[Message]:
    return db.query(Message).filter(Message.thread_id == thread_id).order_by(Message.created_at).all()