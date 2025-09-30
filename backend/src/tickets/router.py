from fastapi import APIRouter, HTTPException
from .schemas import Ticket, TicketCreate
from . import crud

router = APIRouter(prefix="/tickets", tags=["Tickets"])
@router.post("/", response_model=Ticket)
def create_ticket(ticket: TicketCreate):
    result = crud.create_ticket(ticket)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return result.data[0]

@router.get("/", response_model=list[Ticket])
def list_tickets():
    return crud.get_tickets()   

@router.get("/{ticket_id}", response_model=Ticket)
def get_ticket(ticket_id: int):
    ticket = crud.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int):
    result = crud.delete_ticket(ticket_id)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}

