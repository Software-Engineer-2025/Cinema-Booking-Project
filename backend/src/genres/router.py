from fastapi import APIRouter, HTTPException
from typing import List

# Import schemas from the local directory
from .schemas import Genre, GenreCreate 

# Import CRUD functions from the local directory
from .crud import get_all_genres, get_genre_by_id, create_genre

# Initialize the FastAPI router for genres
router = APIRouter()

# GET all genres
@router.get("/genres", response_model=List[Genre], summary="Get All Genres")
async def read_genres():
    """
    Retrieves a list of all genres from the database.
    """
    genres_data = get_all_genres()
    return [Genre.model_validate(g) for g in genres_data]

# GET a single genre by ID
@router.get("/genres/{genre_id}", response_model=Genre, summary="Get Genre by ID")
async def read_genre(genre_id: int):
    """
    Retrieves a specific genre by its unique ID.
    """
    genre_data = get_genre_by_id(genre_id)
    if genre_data is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    
    return Genre.model_validate(genre_data)

# POST a new genre
@router.post("/genres", response_model=Genre, status_code=201, summary="Create New Genre")
async def add_genre(genre_data: GenreCreate):
    """
    Creates a new genre in the database.
    """
    try:
        response = create_genre(genre_data)
        return Genre.model_validate(response.data[0])
    except Exception as e:
        # Check for unique constraint violation (genre already exists)
        if "duplicate key value violates unique constraint" in str(e):
            raise HTTPException(status_code=409, detail="Genre name already exists.")
        raise HTTPException(status_code=400, detail=f"Failed to create genre: {e}")
