from .schemas import UserProfileCreate, UserProfileUpdate
from db.supabase import supabase
from typing import List, Optional, Dict, Any


def create_user(user: UserProfileCreate):
    response = supabase.table("userprofile").insert(user.model_dump()).execute()
    return response


def get_users():
    response = supabase.table("userprofile").select("*").execute()
    return response.data


def get_user(user_id: int):
    response = supabase.table("userprofile").select("*").eq("user_id", user_id).single().execute()
    return response.data


def get_profile_by_user_id(user_id: str):
    """Get user profile by Supabase auth user ID (UUID string)"""
    response = supabase.table("userprofile").select("*").eq("user_id", user_id).single().execute()
    if response.error:
        return None
    return response.data


def update_profile_by_user_id(user_id: str, update_data: Dict[str, Any]):
    """Update user profile by Supabase auth user ID"""
    response = supabase.table("userprofile").update(update_data).eq("user_id", user_id).execute()
    return response


def update_user(user_id: int, user: UserProfileUpdate):
    # Only update fields that are not None
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    response = supabase.table("userprofile").update(update_data).eq("user_id", user_id).execute()
    return response


def delete_user(user_id: int):
    response = supabase.table("userprofile").delete().eq("user_id", user_id).execute()
    return response




