from pydantic import BaseModel
from typing import List, Optional

class TheaterSectionBase(BaseModel):
    name: str
    address: str

class TheaterSectionCreate(TheaterSectionBase):
    pass

class TheaterSectionUpdate(TheaterSectionBase):
    name: Optional[str] = None
    address: Optional[str] = None

class TheaterSectionInDBBase(TheaterSectionBase):
    id: int

    class Config:
        orm_mode = True
    

class TheaterSection(TheaterSectionInDBBase):
    pass

__all__ = [
    "TheaterSection",
    "TheaterSectionCreate",
    "TheaterSectionUpdate",
    "TheaterSectionInDBBase",
]



