from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

# Ticket schemas
class TicketBase(BaseModel):
    seat_id: int
    show_id: int
    ticket_type: str = "adult"  # adult, child, or senior
    price: float

class TicketCreate(BaseModel):
    seat_id: int
    ticket_type: str = "adult"
    price: float

class Ticket(BaseModel):
    ticket_id: int
    booking_id: int
    seat_id: int
    show_id: int
    ticket_type: str
    price: float

    class Config:
        from_attributes = True

# Booking schemas
class BookingCreate(BaseModel):
    user_id: uuid.UUID
    show_id: int
    total_amount: float
    tickets: List[TicketCreate] 

class Booking(BaseModel):
    booking_id: int
    user_id: uuid.UUID
    show_id: int
    booking_date: datetime
    total_amount: float
    status: str

    class Config:
        from_attributes = True

class BookingWithTickets(Booking):
    tickets: List[Ticket] = []
