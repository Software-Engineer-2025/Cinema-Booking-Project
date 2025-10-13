from typing import List, Optional
from db.supabase import supabase  # Assumes db.supabase module exists and exposes a configured client

from .schemas import SeatCreate

# Define the table name for the Seat data
TABLE_NAME = "Seat"

def create_seat(seat: SeatCreate):
    # Insert seat data, returning the created object
    response = supabase.table(TABLE_NAME).insert(seat.model_dump()).select().single().execute()
    return response

def get_all_seats() -> List[dict]:
    #Retrieves all seats from the database.
    response = supabase.table(TABLE_NAME).select("*").execute()
    return response.data

def get_seat_by_id(seat_id: int) -> Optional[dict]:

    try:
        response = supabase.table(TABLE_NAME).select("*").eq("seat_id", seat_id).single().execute()
        return response.data
    except Exception as e:
        # Assume "Row not found" if an exception occurs during .single()
        if "Row not found" in str(e):
            return None
        raise e

def delete_seat(seat_id: int):
    # Delete the seat where seat_id matches
    response = supabase.table(TABLE_NAME).delete().eq("seat_id", seat_id).execute()
    return response
