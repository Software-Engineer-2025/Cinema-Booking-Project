from fastapi import APIRouter, HTTPException
from typing import List
from .schemas import Genre, GenreCreate 
from .crud import get_all_genres, get_genre_by_id, create_genre

router = APIRouter()

@router.get("/genres", response_model=List[Genre], summary="Get All Genres")
def read_genres():
    """
    Retrieves a list of all genres from the database.
    """
    genres_data = get_all_genres()
    return [Genre.model_validate(g) for g in genres_data]

@router.get("/genres/{genre_id}", response_model=Genre, summary="Get Genre by ID")
def read_genre(genre_id: int):
    """
    Retrieves a specific genre by its unique ID.
    """
    genre_data = get_genre_by_id(genre_id)
    if genre_data is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    
    return Genre.model_validate(genre_data)

@router.post("/genres", response_model=Genre, status_code=201, summary="Create New Genre")
def add_genre(genre_data: GenreCreate):
    """
    Creates a new genre in the database.
    """
    result = create_genre(genre_data)
    
    if result.get('data'):
        return Genre.model_validate(result['data'])
    else:
        error_msg = result.get('error', 'Failed to create genre')
        status_code = result.get('status_code', 500)
        
        if "duplicate key value violates unique constraint" in error_msg or "already exists" in error_msg:
            raise HTTPException(status_code=409, detail="Genre name already exists.")
        elif status_code == 400:
            raise HTTPException(status_code=400, detail=error_msg)
        else:
            raise HTTPException(status_code=500, detail=error_msg)
