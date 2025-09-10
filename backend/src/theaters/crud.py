from .schemas import TheaterCreate, TheaterUpdate
from db.supabase import supabase

def create_theater(theater: TheaterCreate):
    response = supabase.table("Theater").insert(theater.dict()).execute()
    return response

def get_theaters():
    response = supabase.table("Theater").select("*").execute()
    return response.data

def get_theater(theater_id: int):
    response = supabase.table("Theater").select("*").eq("id", theater_id).single().execute()
    return response.data

def update_theater(theater_id: int, theater: TheaterUpdate):
    response = supabase.table("Theater").update(theater.dict()).eq("id", theater_id).execute()
    return response

def delete_theater(theater_id: int):
    response = supabase.table("Theater").delete().eq("id", theater_id).execute()
    return response

