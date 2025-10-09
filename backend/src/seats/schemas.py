from pydantic import BaseModel
from typing import Optional

class SeatBase(BaseModel):
    row_letter: str
    column_number: int
    showroom_id: int

class SeatCreate(SeatBase):
    pass

class Seat(SeatBase):
    seat_id: int

    class Config:
        from_attributes = True

class SeatUpdate(BaseModel):
    row_letter: Optional[str] = None
    column_number: Optional[int] = None
    showroom_id: Optional[int] = None

__all__ = [
    "SeatBase",
    "SeatCreate",
    "Seat", 
    "SeatUpdate",
]
