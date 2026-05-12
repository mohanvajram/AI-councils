from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import discussions, keys

settings = get_settings()

app = FastAPI(
    title="AI Council API",
    description="Multi-AI discussion platform backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(discussions.router)
app.include_router(keys.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-council-api"}
