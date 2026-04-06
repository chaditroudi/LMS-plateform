"""AI Tutor Service — FastAPI + OpenAI"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, recommendations, quiz
from app.llm import is_groq_available, LLM_MODEL

app = FastAPI(
    title="LMS AI Tutor Service",
    description="AI-powered Q&A, recommendations, and quiz generation via OpenAI",
    version="3.0.0",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/ai/chat", tags=["chat"])
app.include_router(recommendations.router, prefix="/api/ai/recommendations", tags=["recommendations"])
app.include_router(quiz.router, prefix="/api/ai/quiz", tags=["quiz"])


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ai-tutor-service",
        "llm_backend": "groq",
        "llm_model": LLM_MODEL,
        "api_key_configured": await is_groq_available(),
    }
