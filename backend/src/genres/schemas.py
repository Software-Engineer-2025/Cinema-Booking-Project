from pydantic import BaseModel
from typing import Optional

class GenreBase(BaseModel):
    name: str

class GenreCreate(GenreBase):
    pass

class Genre(GenreBase):
    genre_id: int

    class Config:
        from_attributes = True

class GenreUpdate(BaseModel):
    name: Optional[str] = None

__all__ = [
    "GenreBase",
    "GenreCreate",
    "Genre",
    "GenreUpdate",
]
