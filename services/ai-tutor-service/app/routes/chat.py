from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    course_id: int
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    course_id: int


@router.post("/", response_model=ChatResponse)
async def chat_with_tutor(request: ChatRequest):
    """
    AI-powered Q&A based on course content.
    In production, this would connect to a local LLM (e.g., Ollama/Llama2).
    Currently returns a contextual placeholder response.
    """
    reply = (
        f"Thank you for your question about course {request.course_id}. "
        f"You asked: '{request.message}'. "
        "This is a placeholder response. In production, this endpoint connects to a local LLM "
        "(such as Llama2 via Ollama) to provide contextual answers based on the course content."
    )

    return ChatResponse(reply=reply, course_id=request.course_id)
