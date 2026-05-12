from fastapi import APIRouter, HTTPException
from models.schemas import DiscussionRequest, DiscussionResponse
from services import supabase_service as db
from services import ai_service
from config import get_settings

router = APIRouter(prefix="/api/discussions", tags=["discussions"])


@router.post("", response_model=DiscussionResponse)
async def run_discussion(req: DiscussionRequest):
    settings = get_settings()

    # Resolve API keys: request body overrides > DB keys > env keys
    stored = db.get_api_keys(req.user_identifier) or {}

    openai_key = req.openai_key or stored.get("openai_key") or settings.openai_api_key
    gemini_key = req.gemini_key or stored.get("gemini_key") or settings.gemini_api_key
    anthropic_key = req.anthropic_key or stored.get("anthropic_key") or settings.anthropic_api_key

    if not anthropic_key:
        raise HTTPException(400, "Anthropic API key is required for synthesis")

    # Create session
    title = req.question[:60] + ("…" if len(req.question) > 60 else "")
    session = db.create_session(question=req.question, title=title)
    session_id = session["id"]

    responses = []
    saved_messages = []
    order = 0

    ai_plan = []
    if req.use_openai and openai_key:
        ai_plan.append(("ChatGPT", "gpt-4o", ai_service.call_openai, openai_key))
    if req.use_gemini and gemini_key:
        ai_plan.append(("Gemini", "gemini-1.5-flash-latest", ai_service.call_gemini, gemini_key))
    if req.use_claude and anthropic_key:
        ai_plan.append(("Claude", "claude-3-5-sonnet-20241022", ai_service.call_claude, anthropic_key))

    for ai_name, ai_model, call_fn, key in ai_plan:
        try:
            text = await call_fn(req.question, responses, key)
        except Exception as e:
            text = f"[Error from {ai_name}: {str(e)}]"

        msg = db.save_message(session_id, ai_name, ai_model, text, order)
        saved_messages.append(msg)
        responses.append({"ai_name": ai_name, "content": text})
        order += 1

    # Synthesize
    synthesis = None
    if len(responses) > 1:
        try:
            syn_text = await ai_service.synthesize(req.question, responses, anthropic_key)
            synthesis = db.save_synthesis(session_id, syn_text)
        except Exception as e:
            synthesis = None

    from models.schemas import SessionOut, MessageOut, SynthesisOut
    session_out = SessionOut(**session)
    messages_out = [MessageOut(**m) for m in saved_messages]
    syn_out = SynthesisOut(**synthesis) if synthesis else None

    return DiscussionResponse(session=session_out, messages=messages_out, synthesis=syn_out)


@router.get("", response_model=list)
async def list_sessions():
    return db.get_all_sessions()


@router.get("/{session_id}", response_model=DiscussionResponse)
async def get_session(session_id: str):
    session = db.get_session_by_id(session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    messages = db.get_messages_by_session(session_id)
    synthesis = db.get_synthesis_by_session(session_id)

    from models.schemas import SessionOut, MessageOut, SynthesisOut
    return DiscussionResponse(
        session=SessionOut(**session),
        messages=[MessageOut(**m) for m in messages],
        synthesis=SynthesisOut(**synthesis) if synthesis else None,
    )
