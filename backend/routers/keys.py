from fastapi import APIRouter, HTTPException
from models.schemas import ApiKeysPayload
from services import supabase_service as db

router = APIRouter(prefix="/api/keys", tags=["api-keys"])


@router.post("")
async def save_keys(payload: ApiKeysPayload):
    result = db.upsert_api_keys(
        user_identifier=payload.user_identifier,
        openai_key=payload.openai_key,
        gemini_key=payload.gemini_key,
        anthropic_key=payload.anthropic_key,
    )
    return {"success": True, "user_identifier": result["user_identifier"]}


@router.get("/{user_identifier}")
async def get_keys(user_identifier: str):
    keys = db.get_api_keys(user_identifier)
    if not keys:
        return {"openai_key": None, "gemini_key": None, "anthropic_key": None}
    # Mask keys for security
    def mask(k):
        if not k:
            return None
        return k[:8] + "…" + k[-4:]
    return {
        "openai_key": mask(keys.get("openai_key")),
        "gemini_key": mask(keys.get("gemini_key")),
        "anthropic_key": mask(keys.get("anthropic_key")),
        "has_openai": bool(keys.get("openai_key")),
        "has_gemini": bool(keys.get("gemini_key")),
        "has_anthropic": bool(keys.get("anthropic_key")),
    }
