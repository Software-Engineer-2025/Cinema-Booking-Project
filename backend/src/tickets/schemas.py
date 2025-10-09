from pydantic import BaseModel
from typing import Optional

class TicketBase(BaseModel):
    user_id: Optional[int] = None
    price: float
    status: Optional[str] = "reserved"  # Updated default to match database
    seat_id: int  # Reference to seat table
    show_id: int  # Reference to show table

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    ticket_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

class TicketUpdate(BaseModel):
    user_id: Optional[int] = None
    price: Optional[float] = None
    status: Optional[str] = None
    seat_id: Optional[int] = None
    show_id: Optional[int] = None

    
