from .schemas import UserProfileCreate, UserProfileUpdate
from db.supabase import supabase
from typing import List, Optional, Dict, Any


def create_user_profile(user_id: str, user: UserProfileCreate):
    """Create a user profile with a specific user_id (UUID from Supabase Auth)"""
    try:
        user_data = user.model_dump()
        user_data['user_id'] = user_id  # Add the required user_id
        response = supabase.table("userprofile").insert(user_data).execute()
        return response
    except Exception as e:
        print(f"Exception creating profile: {e}")
        raise e


def get_users():
    """Get all user profiles"""
    response = supabase.table("userprofile").select("*").execute()
    return response.data


def get_profile_by_user_id(user_id: str):
    """Get user profile by Supabase auth user ID (UUID string)"""
    try:
        response = supabase.table("userprofile").select("*").eq("user_id", user_id).single().execute()
        return response.data
    except Exception as e:
        print(f"Exception getting profile: {e}")
        return None


def update_profile_by_user_id(user_id: str, update_data: Dict[str, Any]):
    """Update user profile by Supabase auth user ID"""
    try:
        response = supabase.table("userprofile").update(update_data).eq("user_id", user_id).execute()
        return response
    except Exception as e:
        print(f"Exception updating profile: {e}")
        raise e


def delete_profile_by_user_id(user_id: str):
    """Delete user profile by Supabase auth user ID"""
    try:
        response = supabase.table("userprofile").delete().eq("user_id", user_id).execute()
        return response
    except Exception as e:
        print(f"Exception deleting profile: {e}")
        raise e




