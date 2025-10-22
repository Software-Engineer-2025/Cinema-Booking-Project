from typing import List, Optional
from db.supabase import supabase  # Assumes db.supabase module exists and exposes a configured client

from .schemas import SeatCreate


def _exists(table: str, pk_col: str, pk_val: int) -> bool:
    if pk_val is None:
        return False
    res = supabase.table(table).select(pk_col).eq(pk_col, pk_val).limit(1).execute()
    return bool(res.data)

def _seat_exists(showroom_id: int, row_letter: str, column_number: int) -> bool:
    res = (
        supabase.table("seat")
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
    Works with clients that return 204/No Content on insert.
    """
    payload = seat.model_dump()

    # Let DB generate PK if caller didn’t provide one
    payload.pop("seat_id", None)

    # Insert first (no .select() chain)
    resp = supabase.table("seat").insert(payload).execute()
    row = (getattr(resp, "data", None) or [None])[0]
    if row:
        return {"data": row, "status_code": 201}

    # Fallback: fetch via near-unique triple
    fetched = (
        supabase.table("seat")
        .select("*")
        .eq("showroom_id", payload["showroom_id"])
        .eq("row_letter", payload["row_letter"])
        .eq("column_number", payload["column_number"])
        .limit(1)
        .execute()
    ).data or []

    if not fetched:
        return {"error": "Failed to create seat", "status_code": 400}

    return {"data": fetched[0], "status_code": 201}

def get_all_seats() -> List[dict]:
    """
    Retrieves all seats from the database.
    
    :return: A list of seat dictionaries.
    """
    # Select all columns from the Seat table
    response = supabase.table("seat").select("*").execute()
    return response.data

def get_seat_by_id(seat_id: int) -> Optional[dict]:
    """
    Retrieves a single seat by its unique ID.
    
    :param seat_id: The ID of the seat to fetch.
    :return: A seat dictionary, or None if not found.
    """
    try:
        # Select all columns for the specific seat_id and execute as a single result
        response = supabase.table("seat").select("*").eq("seat_id", seat_id).single().execute()
        return response.data
    except Exception as e:
        # Assume "Row not found" if an exception occurs during .single()
        if "Row not found" in str(e):
            return None
        raise e

def delete_seat(seat_id: int):
    exists = supabase.table("seat").select("seat_id").eq("seat_id", seat_id).limit(1).execute()
    if not (exists.data or []):
        return {"error": "Seat not found", "status_code": 404}

    try:
        resp = supabase.table("seat").delete().eq("seat_id", seat_id).execute()
        status = getattr(resp, "status_code", 204) or 204
        if 200 <= status < 300:
            return {"success": True}
        # Map possible FK violation (seat referenced elsewhere) to 409
        err = getattr(resp, "error", None)
        if err and getattr(err, "code", "") == "23503":
            return {"error": "Cannot delete: seat is referenced", "status_code": 409}
        return {"error": "Failed to delete seat", "status_code": status}
    except Exception as e:
        msg = str(e).lower()
        if "23503" in msg or "foreign key" in msg:
            return {"error": "Cannot delete: seat is referenced", "status_code": 409}
        return {"error": "Could not delete seat", "status_code": 500}
