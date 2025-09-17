from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class MovieBase(BaseModel):
    title: str
    release_date: date = None
    genre: str = None
    director: str = None
    cast_list: List[str] = []
    rating: float = None
    producer: str = None
    synopsis: str = None
    reviews: List[str] = []
    trailer_img: str = None
    trailer_video: str = None
    MPAA_rating: str = None
    show_times: List[datetime] = []
    released: bool = False

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    movie_id: int

    class Config:
        orm_mode = True