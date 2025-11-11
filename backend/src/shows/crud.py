from typing import List, Optional, Dict
from .schemas import Show, ShowCreate, ShowUpdate
from db.supabase import supabase, supabase_admin 



def get_all_shows() -> List[dict]:
    response = supabase_admin.table("show").select("*").execute()
    return response.data

def get_show_by_id(show_id: int) -> Optional[dict]:
        response = supabase_admin.table("show").select("*").eq("show_id", show_id).limit(1).execute()
        rows = response.data or []
        return rows[0] if rows else None

def get_shows_by_movie(movie_id: int) -> List[Dict]:
    response = supabase_admin.table("show").select("*").eq("movie_id", movie_id).execute()
    return response.data

def get_show_by_date(date_str: str) -> List[dict]:
     response = supabase_admin.table("show").select("*").eq("date", date_str).execute()
     return response.data or []

def delete_show(show_id: int):
    try:
        response = supabase_admin.table("show").delete().eq("show_id", show_id).execute()
        
        if not response.data:
            return {"error": {"message": f"Show with ID {show_id} not found"}, "data": None}
            
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def create_show(show: ShowCreate):
    try:
        show_data = show.model_dump()
        
        max_result = supabase_admin.table("show").select("show_id").order("show_id", desc=True).limit(1).execute()
        if max_result.data:
            next_id = max_result.data[0]['show_id'] + 1
        else:
            next_id = 1
        
        show_data['show_id'] = next_id
        
        if 'date' in show_data and show_data['date']:
            show_data['date'] = show_data['date'].isoformat()
        if 'time' in show_data and show_data['time']:
            show_data['time'] = show_data['time'].isoformat()
        
        response = supabase_admin.table("show").insert(show_data).execute()
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def _exists(table: str, pk_col: str, pk_val: int) -> bool:
    res = supabase.table(table).select(pk_col).eq(pk_col, pk_val).limit(1).execute()
    return bool(res.data)

def _exists_admin(table: str, pk_col: str, pk_val: int) -> bool:
    from db.supabase import supabase_admin
    res = supabase_admin.table(table).select(pk_col).eq(pk_col, pk_val).limit(1).execute()
    return bool(res.data)

def update_show(show_id: int, show: ShowUpdate):
    try:
        update_data = show.model_dump(exclude_unset=True, exclude_none=True)

        if not update_data:
            return {"error": "Nothing to update", "status_code": 400}
            
        if 'date' in update_data and update_data['date']:
            update_data['date'] = update_data['date'].isoformat()
        if 'time' in update_data and update_data['time']:
            update_data['time'] = update_data['time'].isoformat()
            
        for fk in ("movie_id", "showroom_id"):
            if fk in update_data and (not update_data[fk] or update_data[fk] == 0):
                update_data.pop(fk)
                
        from db.supabase import supabase_admin
        if "movie_id" in update_data:
            mv = update_data["movie_id"]
            if not _exists_admin("movie", "movie_id", mv):
                return {"error": "Invalid movie_id", "status_code": 409}

        if "showroom_id" in update_data:
            sr = update_data["showroom_id"]
            if not _exists_admin("showroom", "showroom_id", sr):
                return {"error": "Invalid showroom_id", "status_code": 409}
                
        resp = supabase_admin.table("show").update(update_data).eq("show_id", show_id).execute()
        rows = getattr(resp, "data", None) or []

        if rows:
            return {"data": rows[0], "status_code": 200}

        check = supabase_admin.table("show").select("*").eq("show_id", show_id).limit(1).execute()
        got = check.data or []
        if not got:
            return {"error": "Show not found", "status_code": 404}
        return {"data": got[0], "status_code": 200}
    except Exception as e:
        return {"error": str(e), "status_code": 500}