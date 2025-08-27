from fastapi import FastAPI
from db import supabase

app = FastAPI()

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
