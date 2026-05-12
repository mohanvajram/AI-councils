from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class ApiKeysPayload(BaseModel):
    user_identifier: str
    openai_key: Optional[str] = None
    gemini_key: Optional[str] = None
    anthropic_key: Optional[str] = None


class DiscussionRequest(BaseModel):
    question: str
    user_identifier: str
    use_openai: bool = True
    use_gemini: bool = True
    use_claude: bool = True
    # Optional overrides (if not provided, backend uses keys from DB)
    openai_key: Optional[str] = None
    gemini_key: Optional[str] = None
    anthropic_key: Optional[str] = None


class MessageOut(BaseModel):
    id: str
    session_id: str
    ai_name: str
    ai_model: str
    content: str
    order_index: int
    created_at: datetime


class SynthesisOut(BaseModel):
    id: str
    session_id: str
    content: str
    created_at: datetime


class SessionOut(BaseModel):
    id: str
    title: str
    question: str
    created_at: datetime
    messages: Optional[List[MessageOut]] = []
    synthesis: Optional[SynthesisOut] = None


class DiscussionResponse(BaseModel):
    session: SessionOut
    messages: List[MessageOut]
    synthesis: Optional[SynthesisOut] = None
