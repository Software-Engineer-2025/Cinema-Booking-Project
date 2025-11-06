from typing import Dict, List, Optional
from .schemas import PromotionCreate
from db.supabase import supabase, supabase_admin
from datetime import date

async def create_promotion(promotion: PromotionCreate) -> Dict:
    try:
        data = promotion.model_dump()
        
        # Validate discount
        if data.get("discount", 0) <= 0:
            raise ValueError("Discount must be greater than 0")
        
        # Validate date format (basic check)
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

async def validate_promotion_for_user(user_id: str, promo_code: str) -> Dict:
    """
    Validate if a user can use a specific promotion.
    Direct validation without database functions.
    """
    try:
        # Check if user exists and has promotion = true
        user_response = supabase_admin.table("userprofile").select("promotion").eq("user_id", user_id).execute()
        if not user_response.data:
            return {"valid": False, "error": "User not found"}
        
        user = user_response.data[0]
        if not user["promotion"]:
            return {"valid": False, "error": "User is not eligible for promotions (promotion must be true)"}
        
        # Check if promotion exists and is valid
        promo_response = supabase.table("promotion").select("*").eq("promo_code", promo_code).execute()
        if not promo_response.data:
            return {"valid": False, "error": "Invalid promotion code"}
        
        promo = promo_response.data[0]
        
        # Check date validity (simplified - you can add date checks here)
        return {
            "valid": True,
            "discount": promo["discount"],
            "promotion_id": promo["promotion_id"]
        }
    except Exception as e:
        return {"valid": False, "error": f"Validation error: {str(e)}"}

async def apply_promotion_to_user(user_id: str, promo_code: str) -> Dict:
    """
    Apply a promotion to a user (simplified version).
    """
    try:
        # First validate the promotion
        validation = await validate_promotion_for_user(user_id, promo_code)
        if not validation["valid"]:
            return {"success": False, "error": validation["error"]}
        
        # For now, just return success without updating user status
        # You can add actual user update logic here if needed
        return {
            "success": True,
            "message": "Promotion applied successfully",
            "discount": validation["discount"]
        }
    except Exception as e:
        return {"success": False, "error": f"Application error: {str(e)}"}

async def check_user_promotion_eligibility(user_id: str) -> Dict:
    """
    Check if a user is eligible to use promotions.
    Returns user's promotion status.
    """
    try:
        user_response = supabase_admin.table("userprofile").select("promotion").eq("user_id", user_id).execute()
        
        if not user_response.data:
            return {"eligible": False, "error": "User not found"}
        
        user = user_response.data[0]
        is_eligible = user["promotion"]  # Eligible if promotion is True
        
        return {
            "eligible": is_eligible,
            "message": "User is eligible for promotions" if is_eligible else "User is not eligible for promotions (promotion must be true)"
        }
    except Exception as e:
        return {"eligible": False, "error": f"Error checking eligibility: {str(e)}"}