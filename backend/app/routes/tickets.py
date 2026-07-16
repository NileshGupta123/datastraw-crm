import os
import re
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from groq import Groq

from app.database import get_db
from app.models import Ticket, Note
from app.schemas import (
    TicketCreate,
    TicketCreateResponse,
    TicketListItem,
    TicketDetail,
    TicketUpdate,
    TicketUpdateResponse,
    AISuggestResponse,
)

router = APIRouter()


def generate_ticket_id(db: Session) -> str:
    """Generates the next sequential ticket ID, e.g. TKT-001, TKT-002..."""
    last_ticket = db.query(Ticket).order_by(Ticket.id.desc()).first()
    if not last_ticket:
        return "TKT-001"
    match = re.search(r"TKT-(\d+)", last_ticket.ticket_id)
    next_num = int(match.group(1)) + 1 if match else last_ticket.id + 1
    return f"TKT-{next_num:03d}"


@router.post("/tickets", response_model=TicketCreateResponse)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    ticket_id = generate_ticket_id(db)

    ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        subject=payload.subject,
        description=payload.description,
        priority=payload.priority or "Medium",
        status="Open",
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return TicketCreateResponse(ticket_id=ticket.ticket_id, created_at=ticket.created_at)


@router.get("/tickets", response_model=list[TicketListItem])
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by Open, In Progress, Closed"),
    search: Optional[str] = Query(None, description="Search by name, ticket_id, email, or description"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.customer_name.ilike(like_pattern),
                Ticket.ticket_id.ilike(like_pattern),
                Ticket.customer_email.ilike(like_pattern),
                Ticket.description.ilike(like_pattern),
            )
        )

    query = query.order_by(Ticket.created_at.desc())
    total = query.count()
    tickets = query.offset((page - 1) * limit).limit(limit).all()

    return tickets


@router.get("/tickets/{ticket_id}", response_model=TicketDetail)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.put("/tickets/{ticket_id}", response_model=TicketUpdateResponse)
def update_ticket(ticket_id: str, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if payload.status:
        valid_statuses = {"Open", "In Progress", "Closed"}
        if payload.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"status must be one of {valid_statuses}")
        ticket.status = payload.status

    if payload.priority:
        valid_priorities = {"Low", "Medium", "High"}
        if payload.priority not in valid_priorities:
            raise HTTPException(status_code=400, detail=f"priority must be one of {valid_priorities}")
        ticket.priority = payload.priority

    if payload.notes:
        note = Note(ticket_id=ticket.id, note_text=payload.notes)
        db.add(note)

    ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ticket)

    return TicketUpdateResponse(success=True, updated_at=ticket.updated_at)


@router.post("/tickets/{ticket_id}/notes")
def add_note(ticket_id: str, note_text: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    note = Note(ticket_id=ticket.id, note_text=note_text)
    db.add(note)
    db.commit()
    db.refresh(note)

    return {"success": True, "note_id": note.id, "created_at": note.created_at}


@router.post("/tickets/{ticket_id}/ai-suggest", response_model=AISuggestResponse)
def ai_suggest(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured on server")

    client = Groq(api_key=api_key)
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    prompt = f"""You are a customer support assistant. Given this support ticket, respond ONLY with a valid JSON object (no markdown, no extra text) with exactly these keys:
- "summary": a one-sentence summary of the customer's issue
- "suggested_priority": one of "Low", "Medium", "High"
- "suggested_priority_reason": a short reason (max 15 words) for that priority
- "suggested_response": a polite, professional draft reply to the customer (2-4 sentences)

Ticket Subject: {ticket.subject}
Ticket Description: {ticket.description}
"""

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        import json
        result = json.loads(completion.choices[0].message.content)

        return AISuggestResponse(
            summary=result.get("summary", ""),
            suggested_priority=result.get("suggested_priority", "Medium"),
            suggested_priority_reason=result.get("suggested_priority_reason", ""),
            suggested_response=result.get("suggested_response", ""),
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI suggestion failed: {str(e)}")