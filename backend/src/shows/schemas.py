from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class ShowBase(BaseModel):
    movie_id: int
    showroom_id: int
    date: date
    time: time

class ShowCreate(ShowBase):
    pass

class Show(ShowBase):
    show_id: int

    class Config:
        from_attributes = True

class ShowUpdate(BaseModel):
    movie_id: Optional[int] = None
    showroom_id: Optional[int] = None  
    date: Optional[date] = None
    time: Optional[time] = None

__all__ = [
    "ShowBase",
    "ShowCreate", 
    "Show",
    "ShowUpdate",
]
