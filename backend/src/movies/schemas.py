from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class MovieBase(BaseModel):
    title: str
    release_date: Optional[date] = None
    director: Optional[str] = None
    cast_list: Optional[List[str]] = []
    rating: Optional[float] = None
    producer: Optional[str] = None
    synopsis: Optional[str] = None
    reviews: Optional[List[str]] = []
    trailer_img: Optional[str] = None
    trailer_video: Optional[str] = None
    mpaa_rating: Optional[str] = None
    duration: int  # Duration in minutes
    released: Optional[bool] = False
    featured: Optional[bool] = False


class MovieCreate(MovieBase):
    genre_names: Optional[List[str]] = None


class Movie(MovieBase):
    movie_id: int
    genre: Optional[List[str]] = None
    show_times: Optional[List[str]] = None

    class Config:
        from_attributes = True