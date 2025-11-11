from pydantic import BaseModel, Field
from typing import Optional

class SeatBase(BaseModel):
    row_letter: str = Field(..., min_length=1, max_length=1, description="Row letter (A-Z)")
    column_number: int = Field(..., gt=0, description="Column number (must be greater than 0)")
    showroom_id: int = Field(..., gt=0, description="Showroom ID (must be greater than 0)")

class SeatCreate(SeatBase):
    pass

class Seat(SeatBase):
    seat_id: int

    class Config:
        from_attributes = True

class SeatUpdate(BaseModel):
    row_letter: Optional[str] = Field(None, min_length=1, max_length=1, description="Row letter (A-Z)")
    column_number: Optional[int] = Field(None, gt=0, description="Column number (must be greater than 0)")
    showroom_id: Optional[int] = Field(None, gt=0, description="Showroom ID (must be greater than 0)")

__all__ = [
    "SeatBase",
    "SeatCreate",
    "Seat", 
    "SeatUpdate",
]
