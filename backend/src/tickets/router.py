from fastapi import APIRouter, HTTPException
from .schemas import BookingCreate, BookingWithTickets
from . import crud
from uuid import UUID

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/", response_model=dict)
def create_booking(booking: BookingCreate):
    """Create a new booking with corresponding tickets"""
    result = crud.create_booking_with_tickets(booking)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/{booking_id}")
def get_booking(booking_id: int):
    """Get a specific booking with all tickets"""
    try:
        booking = crud.get_booking(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/user/{user_id}")
def get_user_bookings(user_id: UUID):
    """Get all bookings for a user"""
    bookings = crud.get_bookings_by_user(user_id)
    return bookings

@router.delete("/{booking_id}")
def cancel_booking(booking_id: int):
    """Cancel a booking (deletes booking and all tickets)"""
    try:
        result = crud.cancel_booking(booking_id)
        if not result.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        return {"message": "Booking deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/show/{show_id}/tickets")
def get_show_tickets(show_id: int):
    """Get all tickets for a show (admin)"""
    tickets = crud.get_tickets_by_show(show_id)
    return tickets

@router.get("/show/{show_id}/available-seats")
def get_available_seats(show_id: int, showroom_id: int):
    """Get available seats for a show"""
    seats = crud.get_available_seats(show_id, showroom_id)
    return seats

