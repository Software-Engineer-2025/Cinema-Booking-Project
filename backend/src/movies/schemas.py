from pydantic import BaseModel, Field
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
    movie_id: int

    class Config:
        orm_mode = True