from pydantic import BaseModel, Field
from typing import Optional

class ShowroomBase(BaseModel):
    capacity: int = Field(..., gt=0, description="The maximum number of seats in the showroom (must be greater than 0)")

class ShowroomCreate(ShowroomBase):
    pass

class Showroom(ShowroomBase):
    showroom_id: int

    class Config:
        from_attributes = True

class ShowroomUpdate(BaseModel):
    capacity: Optional[int] = Field(None, gt=0, description="The maximum number of seats in the showroom (must be greater than 0)")

__all__ = [
    "ShowroomBase",
    "ShowroomCreate", 
    "Showroom",
    "ShowroomUpdate",
]
