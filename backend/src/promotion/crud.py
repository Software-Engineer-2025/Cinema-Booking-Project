from typing import Dict, List, Optional
from .schemas import PromotionCreate
from db.supabase import supabase, supabase_admin
from datetime import date

async def create_promotion(promotion: PromotionCreate) -> Dict:
    try:
        data = promotion.model_dump()
        
        if data.get("discount", 0) <= 0:
            raise ValueError("Discount must be greater than 0")
        
        if data.get("start_date") == "string" or data.get("end_date") == "string":
            raise ValueError("Invalid date format. Use YYYY-MM-DD format")
        
        response = supabase_admin.table("promotion").insert(data).execute()
        return response.data
    except Exception as e:
        raise Exception(f"Failed to create promotion: {str(e)}")

async def get_promotions() -> List[Dict]:
    response = supabase.table("promotion").select("*").execute()
    return response.data

async def get_promotion(promotion_id: str) -> Optional[Dict]:
    response = supabase.table("promotion").select("*").eq("promotion_id", promotion_id).execute()
    return response.data[0] if response.data else None

async def delete_promotion(promotion_id: str) -> bool:
    response = supabase_admin.table("promotion").delete().eq("promotion_id", promotion_id).execute()
    return len(response.data) > 0

async def validate_promotion_code(promo_code: str) -> Dict:
    """
    Validate a promotion code - check if it exists and is active.
    User eligibility should be checked separately in booking system.
    """
    try:
        promo_response = supabase.table("promotion").select("*").eq("promo_code", promo_code).execute()
        if not promo_response.data:
            return {"valid": False, "error": "Invalid promotion code"}
        
        promo = promo_response.data[0]
        
        return {
            "valid": True,
            "discount": promo["discount"],
            "promotion_id": promo["promotion_id"]
        }
    except Exception as e:
        return {"valid": False, "error": f"Validation error: {str(e)}"}

def is_user_on_email_list(user_id: str) -> bool:
    """
    Check if user opted-in for promotions (is on email list).
    Returns True if user has promotion=true, False otherwise.
    """
    try:
        user_response = supabase_admin.table("userprofile").select("promotion").eq("user_id", user_id).execute()
        if not user_response.data:
            return False
        return user_response.data[0]["promotion"]  
    except:
        return False

async def check_user_email_list_status(user_id: str) -> dict:
    """
    Get user's email list status for API endpoints.
    """
    try:
        user_response = supabase_admin.table("userprofile").select("promotion, email, first_name, last_name").eq("user_id", user_id).execute()
        if not user_response.data:
            return {"error": "User not found"}
        
        user = user_response.data[0]
        return {
            "user_id": user_id,
            "email": user["email"],
            "name": f"{user['first_name']} {user['last_name']}",
            "on_email_list": user["promotion"],
            "can_use_promotions": user["promotion"]
        }
    except Exception as e:
        return {"error": f"Error checking email list status: {str(e)}"}

