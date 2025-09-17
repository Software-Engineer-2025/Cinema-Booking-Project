from fastapi import FastAPI
from auth import router as auth_router
from movies import router as movies_router
from theater_sections import router as theater_sections_router
from users import router as users_router
from tickets import router as tickets_router
from theaters import router as theaters_router
from db.supabase import supabase
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.include_router(auth_router.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(movies_router.router, prefix="/api/v1", tags=["Movies"])
app.include_router(theater_sections_router.router, prefix="/api/v1", tags=["TheaterSections"])
app.include_router(tickets_router.router, prefix="/api/v1", tags=["Tickets"])
app.include_router(users_router.router, prefix="/api/v1", tags=["Users"])
app.include_router(theaters_router.router, prefix="/api/v1", tags=["Theaters"])

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

