from .schemas import UserProfileCreate, UserProfileUpdate
from db.supabase import supabase
from typing import List, Optional


def create_user(user: UserProfileCreate):
    response = supabase.table("userprofile").insert(user.model_dump()).execute()
    return response


def get_users():
    response = supabase.table("userprofile").select("*").execute()
    return response.data


def get_user(user_id: int):
    response = supabase.table("userprofile").select("*").eq("user_id", user_id).single().execute()
    return response.data


def update_user(user_id: int, user: UserProfileUpdate):
    # Only update fields that are not None
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    response = supabase.table("userprofile").update(update_data).eq("user_id", user_id).execute()
    return response


def delete_user(user_id: int):
    response = supabase.table("userprofile").delete().eq("user_id", user_id).execute()
    return response

