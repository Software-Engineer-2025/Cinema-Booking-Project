from pydantic import BaseModel, Field
from typing import List, Optional


class MovieBase(BaseModel):
    title: str
    rating: float
    director: str
    release_date: str
    producer: Optional[str] = None
    reviews: Optional[List[str]] = Field(default_factory=list)
    showtimes: Optional[List[str]] = Field(default_factory=list)
    MPAA_rating: Optional[str] = None
    thumbnail: Optional[str] = None
    duration: str
    synopsis: Optional[str] = None
    genre: Optional[str] = None
    cast: Optional[List[str]] = Field(default_factory=list)
    trailer_img: Optional[str] = None
    trailer_url: Optional[str] = None
    released: Optional[bool] = False


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    id: int

    class Config:
        orm_mode = True