"""
AI Tutor Service — FastAPI Application

Microservice that provides AI-powered learning features:
  - Chat       : Contextual Q&A based on course content.
  - Quiz       : AI-generated quiz questions for a course or lesson.
  - Recommendations : Personalised course recommendations based on user profile.

Service Port   : 8004
API Prefix     : /api/ai
Documentation  : http://localhost:8004/docs  (Swagger UI)

Note: In the current implementation all AI responses are stubs/placeholders.
In production these endpoints connect to a local LLM such as Llama2 via
Ollama (configured via the LLM_MODEL environment variable).

Routes summary:
  POST /api/ai/chat              — Converse with the AI tutor
  POST /api/ai/quiz/generate     — Generate quiz questions
  POST /api/ai/recommendations   — Get course recommendations
  GET  /health                   — Liveness probe
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, recommendations, quiz

app = FastAPI(
    title="LMS AI Tutor Service",
    description="AI-powered Q&A, recommendations, and quiz generation",
    version="1.0.0",
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
def health_check():
    """Liveness probe used by Docker and nginx."""
    return {"status": "ok", "service": "ai-tutor-service"}
