from typing import List, Optional
from db.supabase import supabase, supabase_admin

from .schemas import ShowroomCreate

def create_showroom(showroom: ShowroomCreate):
    try:
        showroom_data = showroom.model_dump()
        
        max_result = supabase_admin.table("showroom").select("showroom_id").order("showroom_id", desc=True).limit(1).execute()
        if max_result.data:
            next_id = max_result.data[0]['showroom_id'] + 1
        else:
            next_id = 1
        
        showroom_data['showroom_id'] = next_id
        
        response = supabase_admin.table("showroom").insert(showroom_data).execute()
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def get_all_showrooms() -> List[dict]:
    response = supabase_admin.table("showroom").select("*").execute()
    
    return response.data

def get_showroom_by_id(showroom_id: int) -> Optional[dict]:
    try:
        response = supabase_admin.table("showroom").select("*").eq("showroom_id", showroom_id).single().execute()
        return response.data
    except Exception as e:
        if "Row not found" in str(e):
            return None
        raise e

def update_showroom(showroom_id: int, showroom_data: ShowroomCreate):
    try:
        response = supabase_admin.table("showroom").update(showroom_data.model_dump()).eq("showroom_id", showroom_id).execute()
        
        if not response.data:
            return {"error": {"message": f"Showroom with ID {showroom_id} not found"}, "data": None}
            
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def delete_showroom(showroom_id: int):
    try:
        response = supabase_admin.table("showroom").delete().eq("showroom_id", showroom_id).execute()
        if not response.data:
            return {"error": {"message": f"Showroom with ID {showroom_id} not found"}, "data": None}
            
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}
