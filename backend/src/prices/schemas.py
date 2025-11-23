from pydantic import BaseModel, Field

class PriceBase(BaseModel):
    price_name: str
    amount: float

class PriceCreate(PriceBase):
    pass

class Price(PriceBase):
    price_id: int

    class Config:
        from_attributes = True