from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket
from app.schemas import StatsResponse

router = APIRouter()


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Ticket).count()
    open_count = db.query(Ticket).filter(Ticket.status == "Open").count()
    in_progress_count = db.query(Ticket).filter(Ticket.status == "In Progress").count()
    closed_count = db.query(Ticket).filter(Ticket.status == "Closed").count()

    return StatsResponse(
        total=total,
        open=open_count,
        in_progress=in_progress_count,
        closed=closed_count,
    )