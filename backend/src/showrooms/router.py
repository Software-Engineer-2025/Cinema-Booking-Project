from fastapi import APIRouter, HTTPException, Depends
from typing import List

from .schemas import Showroom, ShowroomCreate 

from .crud import get_all_showrooms, get_showroom_by_id, create_showroom


# Initialize the FastAPI router for showrooms
router = APIRouter()

# GET all showrooms
@router.get("/showrooms", response_model=List[Showroom], summary="Get All Showrooms")
async def read_showrooms():
    """
    Retrieves a list of all theater showrooms with their capacity from the database.
    """
    return await get_all_showrooms()

# GET a single showroom by ID
@router.get("/showrooms/{showroom_id}", response_model=Showroom, summary="Get Showroom by ID")
async def read_showroom(showroom_id: int):
    """
    Retrieves a specific showroom by its unique ID.
    """
    showroom = await get_showroom_by_id(showroom_id)
    if showroom is None:
        raise HTTPException(status_code=404, detail="Showroom not found")
    return showroom

# POST a new showroom
@router.post("/showrooms", response_model=Showroom, status_code=201, summary="Create New Showroom")
async def add_showroom(showroom_data: ShowroomCreate):
    """
    Creates a new showroom in the database.
    
    - **capacity**: The maximum number of seats in the showroom (required).
    """
    return await create_showroom(showroom_data)