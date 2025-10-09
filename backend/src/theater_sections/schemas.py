# This module is deprecated - theater sections have been replaced with showrooms
# Please use the showrooms module instead

from pydantic import BaseModel
from typing import Optional

# Deprecated - kept for backward compatibility
class TheaterSectionBase(BaseModel):
    name: str
    address: str

class TheaterSectionCreate(TheaterSectionBase):
    pass

class TheaterSectionUpdate(TheaterSectionBase):
    name: Optional[str] = None
    address: Optional[str] = None

class TheaterSectionInDBBase(TheaterSectionBase):
    theater_section_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2
    

class TheaterSection(TheaterSectionInDBBase):
    pass

__all__ = [
    "TheaterSection",
    "TheaterSectionCreate",
    "TheaterSectionUpdate",
    "TheaterSectionInDBBase",
]



