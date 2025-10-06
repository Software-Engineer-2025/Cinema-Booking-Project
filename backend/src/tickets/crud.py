from .schemas import TicketCreate, TicketUpdate
from db.supabase import supabase

def create_ticket(ticket: TicketCreate):
    response = supabase.table("ticket").insert(ticket.dict()).execute()
    return response

def get_tickets():
    response = supabase.table("ticket").select("*").execute()
    return response.data

def get_ticket(ticket_id: int):
    response = supabase.table("ticket").select("*").eq("ticket_id", ticket_id).single().execute()
    return response.data

def update_ticket(ticket_id: int, ticket: TicketUpdate):
    response = supabase.table("ticket").update(ticket.dict()).eq("ticket_id", ticket_id).execute()
    return response 

def delete_ticket(ticket_id: int):
    response = supabase.table("ticket").delete().eq("ticket_id", ticket_id).execute()
    return response

