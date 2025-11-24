from typing import Dict, List, Optional
from .schemas import PriceCreate
from db.supabase import supabase, supabase_admin

def create_price(price: PriceCreate):
    try:
        price_data = price.model_dump()

        max_result = supabase_admin.table("price").select("price_id").order("price_id", desc=True).limit(1).execute()
        if max_result.data:
            next_id = max_result.data[0]['price_id'] + 1
        else:
            next_id = 1

        price_data['price_id'] = next_id

        response = supabase_admin.table("price").insert(price_data).execute()

        if not response.data:
            raise Exception("Failed to create price")

        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def get_prices():
    response = supabase_admin.table("price").select("""*""").execute()

    return response.data

def delete_price(price_id: int):
    try:
        response = supabase_admin.table("price").delete().eq("price_id", price_id).execute()
        if not response.data:
            return {"error": "Price not found", "status_code": 404}
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"Delete failed: {e}")
        return {"error": str(e), "status_code": 500}