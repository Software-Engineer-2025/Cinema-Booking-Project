from pydantic import BaseModel, Field
from typing import Optional

class GenreBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Genre name")

class GenreCreate(GenreBase):
    pass

class Genre(GenreBase):
    genre_id: int

    class Config:
        from_attributes = True

class GenreUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Genre name")

__all__ = [
    "GenreBase",
    "GenreCreate",
    "Genre",
    "GenreUpdate",
]
