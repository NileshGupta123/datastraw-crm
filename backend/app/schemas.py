from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# ---------- Note schemas ----------
class NoteCreate(BaseModel):
    note_text: str


class NoteResponse(BaseModel):
    id: int
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Ticket schemas ----------
class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    priority: Optional[str] = "Medium"  # Low / Medium / High


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None  # adds a new note if provided


class TicketListItem(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True


class TicketDetail(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True


class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime


class TicketUpdateResponse(BaseModel):
    success: bool
    updated_at: datetime


# ---------- Stats schema ----------
class StatsResponse(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int


# ---------- AI Assist schema ----------
class AISuggestResponse(BaseModel):
    summary: str
    suggested_priority: str
    suggested_priority_reason: str
    suggested_response: str