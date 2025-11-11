import os
from supabase import Client, create_client
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Should be the sb_secret one

# Default client (uses the key from .env)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Service role client for admin operations (bypasses RLS)
supabase_admin: Client = create_client(SUPABASE_URL or "http://127.0.0.1:54321", SUPABASE_KEY)