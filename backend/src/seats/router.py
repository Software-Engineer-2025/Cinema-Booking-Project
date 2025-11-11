from fastapi import APIRouter, HTTPException, Response
from typing import List

from .schemas import Seat, SeatCreate

from .crud import get_all_seats, get_seat_by_id, create_seat, delete_seat
from .crud import get_available_seats as get_available_seats_crud

router = APIRouter()

@router.get("/seats", response_model=List[Seat], summary="Get All Seats")
def read_seats():
    seats_data = get_all_seats()
    return [Seat.model_validate(seat) for seat in seats_data]

@router.get("/seats/{seat_id}", response_model=Seat, summary="Get Seat by ID")
def read_seat(seat_id: int):
    seat_data = get_seat_by_id(seat_id)
    if seat_data is None:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    return Seat.model_validate(seat_data)

@router.post("/seats", response_model=Seat, status_code=201, summary="Create New Seat")
def add_seat(seat_data: SeatCreate):
    result = create_seat(seat_data)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    return Seat.model_validate(result["data"])

@router.delete("/seats/{seat_id}", status_code=204, summary="Delete Seat by ID")
def remove_seat(seat_id: int):
    result = delete_seat(seat_id)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    return Response(status_code=204)

@router.get("/seats/show/{show_id}/available", response_model=List[Seat], summary="Get Available Seats for Show")
async def get_available_seats_for_show(show_id: int):
    """
    Get all seats that are not yet booked for a specific show.
    The showroom is automatically determined from the show.
    """
    seats_data = get_available_seats_crud(show_id)
    return [Seat.model_validate(seat) for seat in seats_data]
