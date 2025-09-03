from fastapi import APIRouter, HTTPException
from .schemas import Movie, MovieCreate
from . import crud

router = APIRouter(prefix="/movies", tags=["movies"])

@router.post("/", response_model=Movie)
def create_movie(movie: MovieCreate):
    result = crud.create_movie(movie)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return result.data[0]

@router.get("/", response_model=list[Movie])
def list_movies():
    return crud.get_movies()

@router.get("/{movie_id}", response_model=Movie)
def get_movie(movie_id: int):
    movie = crud.get_movie(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.delete("/{movie_id}")
def delete_movie(movie_id: int):
    result = crud.delete_movie(movie_id)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}