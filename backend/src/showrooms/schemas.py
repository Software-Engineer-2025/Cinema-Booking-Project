from pydantic import BaseModel
from typing import Optional

class ShowroomBase(BaseModel):
    capacity: int

class ShowroomCreate(ShowroomBase):
    pass

class Showroom(ShowroomBase):
    showroom_id: int

    class Config:
        from_attributes = True

class ShowroomUpdate(BaseModel):
    capacity: Optional[int] = None

__all__ = [
    "ShowroomBase",
    "ShowroomCreate", 
    "Showroom",
    "ShowroomUpdate",
]
