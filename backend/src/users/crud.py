from .schemas import UserCreate, UserUpdate
from db.supabase import supabase

def create_user(user: UserCreate):
    response = supabase.table("user").insert(user.dict()).execute()
    return response

def get_users():
    response = supabase.table("user").select("*").execute()
    return response.data

def get_user(user_id: int):
    response = supabase.table("user").select("*").eq("user_id", user_id).single().execute()
    return response.data

def update_user(user_id: int, user: UserUpdate):
    response = supabase.table("user").update(user.dict()).eq("user_id", user_id).execute()
    return response

def delete_user(user_id: int):
    response = supabase.table("user").delete().eq("user_id", user_id).execute()
    return response

