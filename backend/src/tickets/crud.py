from .schemas import BookingCreate, TicketCreate
from db.supabase import supabase
from uuid import UUID

# Booking operations
def create_booking_with_tickets(booking_data: BookingCreate):
    """Create a booking and all associated tickets in a transaction"""
    try:
        # 1. Create the booking
        booking_insert = {
            "user_id": str(booking_data.user_id),
            "show_id": booking_data.show_id,
            "total_amount": booking_data.total_amount,
            "status": "confirmed"
        }
        
        booking_response = supabase.table("booking").insert(booking_insert).execute()
        
        if not booking_response.data:
            return {"error": "Failed to create booking"}
        
        booking_id = booking_response.data[0]["booking_id"]
        
        # 2. Create all tickets for this booking
        tickets_to_insert = [
            {
                "booking_id": booking_id,
                "seat_id": ticket.seat_id,
                "show_id": booking_data.show_id,
                "ticket_type": ticket.ticket_type,
                "price": ticket.price
            }
            for ticket in booking_data.tickets
        ]
        
        tickets_response = supabase.table("ticket").insert(tickets_to_insert).execute()
        
        if not tickets_response.data:
            # Rollback: delete the booking if tickets fail
            supabase.table("booking").delete().eq("booking_id", booking_id).execute()
            return {"error": "Failed to create tickets"}
        
        return {
            "booking": booking_response.data[0],
            "tickets": tickets_response.data
        }
        
    except Exception as e:
        return {"error": str(e)}

def get_booking(booking_id: int):
    """Get a booking with all its tickets"""
    response = supabase.table("booking").select("""
        *,
        ticket (
            *,
            seat (
                row_letter,
                column_number
            )
        )
    """).eq("booking_id", booking_id).single().execute()
    return response.data

def get_bookings_by_user(user_id: UUID):
    """Get all bookings for a user"""
    response = supabase.table("booking").select("""
        *,
        show (
            date,
            time,
            movie (
                title,
                trailer_img
            ),
            showroom (
                showroom_id
            )
        ),
        ticket (
            *,
            seat (
                row_letter,
                column_number
            )
        )
    """).eq("user_id", str(user_id)).order("booking_date", desc=True).execute()
    return response.data

def cancel_booking(booking_id: int):
    """Cancel a booking (deletes booking and tickets cascade)"""
    response = supabase.table("booking").delete().eq("booking_id", booking_id).execute()
    return response

# Ticket operations (for admin/management)
def get_tickets_by_show(show_id: int):
    """Get all tickets for a specific show"""
    response = supabase.table("ticket").select("""
        *,
        booking (
            user_id,
            booking_date,
            status
        ),
        seat (
            row_letter,
            column_number
        )
    """).eq("show_id", show_id).execute()
    return response.data

