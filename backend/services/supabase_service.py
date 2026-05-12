from supabase import create_client, Client
from config import get_settings
from functools import lru_cache


@lru_cache
def get_supabase() -> Client:
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_service_key)


# ---------- Sessions ----------

def create_session(question: str, title: str) -> dict:
    db = get_supabase()
    res = db.table("sessions").insert({"question": question, "title": title}).execute()
    return res.data[0]


def get_all_sessions() -> list:
    db = get_supabase()
    res = db.table("sessions").select("*").order("created_at", desc=True).execute()
    return res.data


def get_session_by_id(session_id: str) -> dict | None:
    db = get_supabase()
    res = db.table("sessions").select("*").eq("id", session_id).single().execute()
    return res.data


# ---------- Messages ----------

def save_message(session_id: str, ai_name: str, ai_model: str, content: str, order_index: int) -> dict:
    db = get_supabase()
    res = db.table("messages").insert({
        "session_id": session_id,
        "ai_name": ai_name,
        "ai_model": ai_model,
        "content": content,
        "order_index": order_index,
    }).execute()
    return res.data[0]


def get_messages_by_session(session_id: str) -> list:
    db = get_supabase()
    res = (db.table("messages")
           .select("*")
           .eq("session_id", session_id)
           .order("order_index")
           .execute())
    return res.data


# ---------- Synthesis ----------

def save_synthesis(session_id: str, content: str) -> dict:
    db = get_supabase()
    res = db.table("syntheses").insert({
        "session_id": session_id,
        "content": content,
    }).execute()
    return res.data[0]


def get_synthesis_by_session(session_id: str) -> dict | None:
    db = get_supabase()
    res = db.table("syntheses").select("*").eq("session_id", session_id).execute()
    return res.data[0] if res.data else None


# ---------- API Keys ----------

def upsert_api_keys(user_identifier: str, openai_key: str | None, gemini_key: str | None, anthropic_key: str | None) -> dict:
    db = get_supabase()
    payload = {"user_identifier": user_identifier}
    if openai_key is not None:
        payload["openai_key"] = openai_key
    if gemini_key is not None:
        payload["gemini_key"] = gemini_key
    if anthropic_key is not None:
        payload["anthropic_key"] = anthropic_key
    res = db.table("api_keys").upsert(payload, on_conflict="user_identifier").execute()
    return res.data[0]


def get_api_keys(user_identifier: str) -> dict | None:
    db = get_supabase()
    res = db.table("api_keys").select("*").eq("user_identifier", user_identifier).execute()
    return res.data[0] if res.data else None