from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class MovieBase(BaseModel):
    title: str
    release_date: Optional[date] = None
    director: Optional[str] = None
    cast_list: Optional[str] = None  # Database stores as comma-separated string
    rating: Optional[float] = None
    producer: Optional[str] = None
    synopsis: Optional[str] = None
    reviews: Optional[str] = None  # Database stores as comma-separated string
    trailer_img: Optional[str] = None
    trailer_video: Optional[str] = None
    mpaa_rating: Optional[str] = None
    released: Optional[bool] = False
    featured: Optional[bool] = False


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    movie_id: int
    # Frontend-compatible fields (computed from relationships)
    genre: Optional[List[str]] = None  # Combined from MovieGenre relationships as array
    cast_list: Optional[List[str]] = None  # Converted from comma-separated string
    reviews: Optional[List[str]] = None  # Converted from comma-separated string
    show_times: Optional[List[str]] = None  # Computed from Show relationships

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2