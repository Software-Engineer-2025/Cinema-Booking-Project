from pydantic import BaseModel
from typing import List, Optional

class TicketBase(BaseModel):
    seat : str
    is_taken : bool
    price : float
    status : Optional[str] = "open"
    user_id : Optional[int] = None
    showtime_id : int

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id : int

    class Config:
        orm_mode = True

class TicketUpdate(BaseModel):
    seat : Optional[str] = None
    is_taken : Optional[bool] = None
    price : Optional[float] = None
    status : Optional[str] = None
    user_id : Optional[int] = None
    showtime_id : Optional[int] = None

    
