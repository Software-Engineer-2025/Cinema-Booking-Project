from typing import List, Optional
from db.supabase import supabase, supabase_admin

from .schemas import SeatCreate


def _exists(table: str, pk_col: str, pk_val: int) -> bool:
    if pk_val is None:
        return False
    res = supabase_admin.table(table).select(pk_col).eq(pk_col, pk_val).limit(1).execute()
    return bool(res.data)

def _seat_exists(showroom_id: int, row_letter: str, column_number: int) -> bool:
    res = (
        supabase_admin.table("seat")
        .select("seat_id")
        .eq("showroom_id", showroom_id)
        .eq("row_letter", row_letter)
        .eq("column_number", column_number)
        .limit(1)
        .execute()
    )
    return bool(res.data)

def create_seat(seat: SeatCreate):
    """
    Create a seat and return the created row.
    """
    try:
        seat_data = seat.model_dump()
        showroom_exists = supabase_admin.table("showroom").select("showroom_id").eq("showroom_id", seat_data["showroom_id"]).limit(1).execute()
        if not showroom_exists.data:
            return {"error": "Invalid showroom_id", "status_code": 400}
        
        existing_seat = supabase_admin.table("seat").select("seat_id").eq("showroom_id", seat_data["showroom_id"]).eq("row_letter", seat_data["row_letter"]).eq("column_number", seat_data["column_number"]).limit(1).execute()
        if existing_seat.data:
            return {"error": f"Seat already exists at row {seat_data['row_letter']}, column {seat_data['column_number']} in showroom {seat_data['showroom_id']}", "status_code": 409}
        
        max_result = supabase_admin.table("seat").select("seat_id").order("seat_id", desc=True).limit(1).execute()
        if max_result.data:
            next_id = max_result.data[0]['seat_id'] + 1
        else:
            next_id = 1
        
        seat_data['seat_id'] = next_id
        
        response = supabase_admin.table("seat").insert(seat_data).execute()
        
        if response.data:
            return {"data": response.data[0], "status_code": 201}
        else:
            return {"error": "Failed to create seat", "status_code": 400}
            
    except Exception as e:
        return {"error": str(e), "status_code": 500}

def get_all_seats() -> List[dict]:
    response = supabase_admin.table("seat").select("*").execute()
    return response.data

def get_seat_by_id(seat_id: int) -> Optional[dict]:
    try:
        response = supabase_admin.table("seat").select("*").eq("seat_id", seat_id).single().execute()
        return response.data
    except Exception as e:
        if "Row not found" in str(e):
            return None
        raise e

def delete_seat(seat_id: int):
    try:
        exists = supabase_admin.table("seat").select("seat_id").eq("seat_id", seat_id).limit(1).execute()
        if not (exists.data or []):
            return {"error": "Seat not found", "status_code": 404}

        resp = supabase_admin.table("seat").delete().eq("seat_id", seat_id).execute()
        if not resp.data:
            return {"error": "Seat not found", "status_code": 404}
            
        return {"success": True, "data": resp.data[0]}
    except Exception as e:
        msg = str(e).lower()
        if "23503" in msg or "foreign key" in msg:
            return {"error": "Cannot delete: seat is referenced", "status_code": 409}
        return {"error": str(e), "status_code": 500}

def get_available_seats(show_id: int):
    """Get seats that are not yet booked for a show"""
    try:
        # Get the show to find the showroom_id
        show_response = supabase_admin.table("show").select("showroom_id").eq("show_id", show_id).limit(1).execute()
        rows = show_response.data or []
        if not rows:
            return []
        showroom_id = rows[0]["showroom_id"]

        # Get all booked seat IDs for this show
        booked_response = supabase_admin.table("ticket").select("seat_id").eq("show_id", show_id).execute()
        booked_seat_ids = [t.get("seat_id") for t in (booked_response.data or []) if t.get("seat_id") is not None]

        # Get all seats in the showroom that are not booked
        query = supabase_admin.table("seat").select("*").eq("showroom_id", showroom_id)
        if booked_seat_ids:
            # Use the supported supabase-py pattern for NOT IN
            query = query.not_.in_("seat_id", booked_seat_ids)
        response = query.execute()
        return response.data
    except Exception as e:
        # Avoid 500s by returning an empty list on error; log for debugging
        print(f"get_available_seats error for show_id {show_id}: {e}")
        return []
