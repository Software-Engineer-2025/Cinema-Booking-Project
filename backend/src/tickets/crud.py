from .schemas import TicketCreate, TicketUpdate
from db.supabase import supabase

def create_ticket(ticket: TicketCreate):
    response = supabase.table("Ticket").insert(ticket.model_dump()).execute()
    return response

def get_tickets():
    # Get tickets with related data
    response = supabase.table("Ticket").select("""
        *,
        UserProfile (
            first_name,
            last_name
        ),
        Seat (
            row_letter,
            column_number,
            Showroom (
                showroom_id
            )
        ),
        Show (
            date,
            time,
            Movie (
                title
            )
        )
    """).execute()
    return response.data

def get_ticket(ticket_id: int):
    # Get single ticket with related data
    response = supabase.table("Ticket").select("""
        *,
        UserProfile (
            first_name,
            last_name
        ),
        Seat (
            row_letter,
            column_number,
            Showroom (
                showroom_id
            )
        ),
        Show (
            date,
            time,
            Movie (
                title
            )
        )
    """).eq("ticket_id", ticket_id).single().execute()
    return response.data

def update_ticket(ticket_id: int, ticket: TicketUpdate):
    # Only update fields that are not None
    update_data = {k: v for k, v in ticket.model_dump().items() if v is not None}
    response = supabase.table("Ticket").update(update_data).eq("ticket_id", ticket_id).execute()
    return response 

def delete_ticket(ticket_id: int):
    response = supabase.table("Ticket").delete().eq("ticket_id", ticket_id).execute()
    return response

def get_tickets_by_user(user_id: int):
    # Get all tickets for a specific user
    response = supabase.table("Ticket").select("""
        *,
        Seat (
            row_letter,
            column_number,
            Showroom (
                showroom_id
            )
        ),
        Show (
            date,
            time,
            Movie (
                title
            )
        )
    """).eq("user_id", user_id).execute()
    return response.data

