from typing import List, Optional, Dict
from .schemas import Show, ShowCreate, ShowUpdate
from db.supabase import supabase 



def get_all_shows() -> List[dict]:
    response = supabase.table("show").select("*").execute()
    return response.data

# def get_all_shows_by_date(date: DATE) -> List[dict]:
#     response = supabase.table("show").select("*").execute().eq("date")
#     return response.data

def get_show_by_id(show_id: int) -> Optional[dict]:
        response = supabase.table("show").select("*").eq("show_id", show_id).limit(1).execute()
        rows = response.data or []
        return rows[0] if rows else None

def get_shows_by_movie(movie_id: int) -> List[Dict]:
    response = supabase.table("show").select("*").eq("movie_id", movie_id).execute()
    return response.data

def get_show_by_date(date_str: str) -> List[dict]:
     response = supabase.table("show").select("*").eq("date", date_str).execute()
     return response.data or []

def delete_show(show_id: int):
    response = supabase.table("show").delete().eq("show_id", show_id).execute()
    return response

def create_show(show: ShowCreate):
    response = supabase.table("show").insert(show.model_dump()).select().single().execute()
    return response

def _exists(table: str, pk_col: str, pk_val: int) -> bool:
    res = supabase.table(table).select(pk_col).eq(pk_col, pk_val).limit(1).execute()
    return bool(res.data)

def update_show(show_id: int, show: ShowUpdate):
    update_data = show.model_dump(exclude_unset=True, exclude_none=True)

    if not update_data:
        return {"error": "Nothing to update", "status_code": 400}
    for fk in ("movie_id", "showroom_id"):
        if fk in update_data and (not update_data[fk] or update_data[fk] == 0):
            update_data.pop(fk)
    if "movie_id" in update_data:
        mv = update_data["movie_id"]
        if not _exists("movie", "movie_id", mv):
            return {"error": "Invalid movie_id", "status_code": 409}

    if "showroom_id" in update_data:
        sr = update_data["showroom_id"]
        if not _exists("showroom", "showroom_id", sr):
            return {"error": "Invalid showroom_id", "status_code": 409}
    resp = supabase.table("show").update(update_data).eq("show_id", show_id).execute()
    rows = getattr(resp, "data", None) or []

    if rows:
        return {"data": rows[0], "status_code": 200}

    check = supabase.table("show").select("*").eq("show_id", show_id).limit(1).execute()
    got = check.data or []
    if not got:
        return {"error": "Show not found", "status_code": 404}
    return {"data": got[0], "status_code": 200}