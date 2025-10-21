from fastapi import APIRouter, HTTPException
from typing import List

from .schemas import Seat, SeatCreate

from .crud import get_all_seats, get_seat_by_id, create_seat, delete_seat

# Initialize the FastAPI router for seats
router = APIRouter()

# GET all seats
@router.get("/seats", response_model=List[Seat], summary="Get All Seats")
async def read_seats():
    """
    Retrieves a list of all seats from the database.
    """
    # Use the Pydantic model to validate and return the list
    seats_data = get_all_seats()
    return [Seat.model_validate(seat) for seat in seats_data]

# GET a single seat by ID
@router.get("/seats/{seat_id}", response_model=Seat, summary="Get Seat by ID")
async def read_seat(seat_id: int):
    """
    Retrieves a specific seat by its unique ID.
    """
    seat_data = get_seat_by_id(seat_id)
    if seat_data is None:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    return Seat.model_validate(seat_data)

# POST a new seat
@router.post("/seats", response_model=Seat, status_code=201, summary="Create New Seat")
async def add_seat(seat_data: SeatCreate):
    """
    Creates a new seat in the database.
    """
    try:
        response = create_seat(seat_data)
        # Assuming the response.data contains the single inserted record
        return Seat.model_validate(response.data)
    except Exception as e:
        # Catch exceptions (e.g., foreign key violation if showroom_id doesn't exist)
        raise HTTPException(status_code=400, detail=f"Failed to create seat: {e}")

# DELETE a seat
@router.delete("/seats/{seat_id}", status_code=204, summary="Delete Seat by ID")
async def remove_seat(seat_id: int):
    """
    Deletes a specific seat by its unique ID.
    """
    delete_seat(seat_id)
    return {}
