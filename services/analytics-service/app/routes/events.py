from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()


class AnalyticsEvent(BaseModel):
    event_type: str  # "page_view", "enrollment", "lesson_complete", "search"
    user_id: Optional[str] = None
    course_id: Optional[int] = None
    lesson_id: Optional[int] = None
    metadata: Optional[dict] = None


class EventResponse(BaseModel):
    id: str
    event_type: str
    timestamp: str


# In-memory store for demo (production uses PostgreSQL)
events_store: List[dict] = []


@router.post("/", response_model=EventResponse, status_code=201)
async def track_event(event: AnalyticsEvent):
    """Track an analytics event."""
    event_record = {
        "id": str(len(events_store) + 1),
        "event_type": event.event_type,
        "user_id": event.user_id,
        "course_id": event.course_id,
        "lesson_id": event.lesson_id,
        "metadata": event.metadata,
        "timestamp": datetime.utcnow().isoformat(),
    }
    events_store.append(event_record)
    return EventResponse(
        id=event_record["id"],
        event_type=event_record["event_type"],
        timestamp=event_record["timestamp"],
    )


@router.get("/")
async def list_events(
    event_type: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = 50,
):
    """List recent analytics events with optional filters."""
    filtered = events_store
    if event_type:
        filtered = [e for e in filtered if e["event_type"] == event_type]
    if user_id:
        filtered = [e for e in filtered if e["user_id"] == user_id]
    return filtered[-limit:]
