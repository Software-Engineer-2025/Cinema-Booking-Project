from fastapi import APIRouter, HTTPException, Response
from .schemas import Movie, MovieCreate
from . import crud

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("/genres", response_model=list[str])
def get_genres():
    genres = crud.get_genres()
    return genres

@router.post("/", response_model=Movie)
def create_movie(movie: MovieCreate):
    result = crud.create_movie(movie)
    
    if isinstance(result, dict) and result.get('error'):
        raise HTTPException(status_code=400, detail=result['error']['message'])
    elif hasattr(result, 'error') and result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    elif hasattr(result, 'data') and result.data:
        return result.data[0]
    else:
        raise HTTPException(status_code=500, detail="Unexpected response format")

@router.get("/", response_model=list[Movie])
def list_movies():
    return crud.get_movies()

@router.get("/{movie_id}", response_model=Movie)
def get_movie(movie_id: int):
    movie = crud.get_movie(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.delete("/{movie_id}", status_code=204)
def delete_movie(movie_id: int):
    result = crud.delete_movie(movie_id)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    return Response(status_code=204)