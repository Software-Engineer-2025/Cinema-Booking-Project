from pydantic import BaseModel
from typing import List, Optional

class MovieBase(BaseModel):
    title: str
    rating: float
    thumbnail: Optional[str] = None
    duration: str
    synopsis: Optional[str] = None
    genre: Optional[str] = None
    cast: Optional[List[str]] = []
    creators: Optional[List[str]] = []
    trailer: Optional[str] = None
    released: bool = False

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        orm_mode = True