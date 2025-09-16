from .schemas import TicketCreate, TicketUpdate
from db.supabase import supabase

def create_ticket(ticket: TicketCreate):
    response = supabase.table("Ticket").insert(ticket.dict()).execute()
    return response

def get_tickets():
    response = supabase.table("Ticket").select("*").execute()
    return response.data

def get_ticket(ticket_id: int):
    response = supabase.table("Ticket").select("*").eq("id", ticket_id).single().execute()
    return response.data

def update_ticket(ticket_id: int, ticket: TicketUpdate):
    response = supabase.table("Ticket").update(ticket.dict()).eq("id", ticket_id).execute()
    return response 

def delete_ticket(ticket_id: int):
    response = supabase.table("Ticket").delete().eq("id", ticket_id).execute()
    return response

