from fastapi import APIRouter, HTTPException, Response, Depends
from .schemas import Price, PriceCreate
from . import crud
from auth.security import require_admin

router = APIRouter(prefix="/prices", tags=["Prices"])


@router.post("/", response_model=Price)
def create_price(price: PriceCreate, _admin: dict = Depends(require_admin)):
    result = crud.create_price(price)

    if isinstance(result, dict) and result.get('error'):
        raise HTTPException(status_code=400, detail=result['error']['message'])
    elif hasattr(result, 'error') and result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    elif hasattr(result, 'data') and result.data:
        return result.data[0]
    else:
        raise HTTPException(status_code=500, detail="Unexpected response format")

@router.get("/", response_model=list[Price])
def list_prices():
    return crud.get_prices()

@router.delete("/{price_id}", status_code=204)
def delete_price(price_id: int, _admin: dict = Depends(require_admin)):
    result = crud.delete_price(price_id)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    return Response(status_code=204)