from .schemas import UserCreate, UserUpdate
from db.supabase import supabase

def create_user(user: UserCreate):
    response = supabase.table("User").insert(user.dict()).execute()
    return response

def get_users():
    response = supabase.table("User").select("*").execute()
    return response.data

def get_user(user_id: int):
    response = supabase.table("User").select("*").eq("id", user_id).single().execute()
    return response.data

def update_user(user_id: int, user: UserUpdate):
    response = supabase.table("User").update(user.dict()).eq("id", user_id).execute()
    return response

def delete_user(user_id: int):
    response = supabase.table("User").delete().eq("id", user_id).execute()
    return response

