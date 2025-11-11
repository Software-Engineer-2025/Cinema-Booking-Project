from .schemas import TicketCreate, TicketUpdate
from db.supabase import supabase, supabase_admin

def create_ticket(ticket: TicketCreate):
    try:
        ticket_data = ticket.model_dump()
        
        max_result = supabase_admin.table("ticket").select("ticket_id").order("ticket_id", desc=True).limit(1).execute()
        if max_result.data:
            next_id = max_result.data[0]['ticket_id'] + 1
        else:
            next_id = 1
        
        ticket_data['ticket_id'] = next_id
        
        response = supabase_admin.table("ticket").insert(ticket_data).execute()
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def get_tickets():
    response = supabase_admin.table("ticket").select("""
        *,
        userprofile (
            first_name,
            last_name
        ),
        seat (
            row_letter,
            column_number,
            showroom (
                showroom_id
            )
        ),
        show (
            date,
            time,
            movie (
                title
            )
        )
    """).execute()
    return response.data

def get_ticket(ticket_id: int):
    response = supabase_admin.table("ticket").select("""
        *,
        userprofile (
            first_name,
            last_name
        ),
        seat (
            row_letter,
            column_number,
            showroom (
                showroom_id
            )
        ),
        show (
            date,
            time,
            movie (
                title
            )
        )
    """).eq("ticket_id", ticket_id).single().execute()
    return response.data

def update_ticket(ticket_id: int, ticket: TicketUpdate):
    update_data = {k: v for k, v in ticket.model_dump().items() if v is not None}
    response = supabase_admin.table("ticket").update(update_data).eq("ticket_id", ticket_id).execute()
    return response 

def delete_ticket(ticket_id: int):
    try:
        response = supabase_admin.table("ticket").delete().eq("ticket_id", ticket_id).execute()
        
        if not response.data:
            return {"error": {"message": f"Ticket with ID {ticket_id} not found"}, "data": None}
            
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def get_tickets_by_user(user_id: int):
    response = supabase_admin.table("ticket").select("""
        *,
        seat (
            row_letter,
            column_number,
            showroom (
                showroom_id
            )
        ),
        show (
            date,
            time,
            movie (
                title
            )
        )
    """).eq("user_id", user_id).execute()
    return response.data

