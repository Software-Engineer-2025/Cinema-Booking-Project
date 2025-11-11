from fastapi import FastAPI
from movies import router as movies_router
from users import router as users_router
from tickets import router as tickets_router
from shows import router as shows_router
from showrooms import router as showrooms_router 
from seats import router as seats_router       
from genres import router as genres_router     
from promotion import router as promotion_router
from db.supabase import supabase
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from paymentcards import router as paymentcards_router

app = FastAPI()

app.include_router(auth_router.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(movies_router.router, prefix="/api/v1")
app.include_router(tickets_router.router, prefix="/api/v1")
app.include_router(users_router.router, prefix="/api/v1")
app.include_router(shows_router.router, prefix="/api/v1")
app.include_router(showrooms_router.router, prefix="/api/v1", tags=["Showrooms"])
app.include_router(seats_router.router, prefix="/api/v1", tags=["Seats"])
app.include_router(genres_router.router, prefix="/api/v1", tags=["Genres"])
app.include_router(promotion_router.router, prefix="/api/v1", tags=["Promotions"])
app.include_router(paymentcards_router.router, prefix="/api/v1", tags=["PaymentCards"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def ping():
    return {"message": "Pong"}

@app.get("/health")
def health_check():
    try:
        user = supabase.auth.get_user()
        return {"status": "ok", "supabase_connected": user}
    except Exception as error:
        return {"status": "error", "supabase_connected": error}

