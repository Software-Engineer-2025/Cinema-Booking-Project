from .schemas import UserCreate, UserUpdate
from db.supabase import supabase

def create_user(user: UserCreate):
    response = supabase.table("UserProfile").insert(user.model_dump()).execute()
    return response

def get_users():
    response = supabase.table("UserProfile").select("*").execute()
    return response.data

def get_user(user_id: int):
    response = supabase.table("UserProfile").select("*").eq("user_id", user_id).single().execute()
    return response.data

def update_user(user_id: int, user: UserUpdate):
    # Only update fields that are not None
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    response = supabase.table("UserProfile").update(update_data).eq("user_id", user_id).execute()
    return response

def delete_user(user_id: int):
    response = supabase.table("UserProfile").delete().eq("user_id", user_id).execute()
    return response

