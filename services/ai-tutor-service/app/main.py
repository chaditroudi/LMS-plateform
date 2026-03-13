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
    return {"status": "ok", "service": "ai-tutor-service"}
