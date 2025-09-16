from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class MovieBase(BaseModel):
    title: str
    release_date: Optional[date] = None
    genre: Optional[str] = None
    director: Optional[str] = None
    cast_list: Optional[List[str]] = []
    rating: Optional[float] = None
    producer: Optional[str] = None
    synopsis: Optional[str] = None
    reviews: Optional[List[str]] = []
    trailer_img: Optional[str] = None
    trailer_video: Optional[str] = None
    MPAA_rating: Optional[str] = None
    show_times: Optional[List[datetime]] = []
    released: bool = False

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    movie_id: int

    class Config:
        orm_mode = True