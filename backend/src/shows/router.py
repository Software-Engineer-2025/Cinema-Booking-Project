from fastapi import APIRouter, HTTPException

from .schemas import Show, ShowCreate, ShowUpdate
from . import crud

router = APIRouter(prefix="/shows", tags=["Shows"])

@router.post("/", response_model=Show)
def create_show(show: ShowCreate):
    result = crud.create_show(show)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return result.data[0]

@router.get("/", response_model=list[Show])
def list_shows():
    return crud.get_shows()

@router.get("/{show_id}", response_model=Show)
def get_show(show_id: int):
    show = crud.get_show(show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show

@router.get("/movie/{movie_id}", response_model=list[Show])
def get_shows_by_movie(movie_id: int):
    shows = crud.get_shows_by_movie(movie_id)
    return shows

@router.get("/date/{date}", response_model=list[Show])
def get_shows_by_date(date: str):
    shows = crud.get_shows_by_date(date)
    return shows

@router.put("/{show_id}", response_model=Show)
def update_show(show_id: int, show: ShowUpdate):
    result = crud.update_show(show_id, show)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return result.data[0]

@router.delete("/{show_id}")
def delete_show(show_id: int):
    result = crud.delete_show(show_id)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}
