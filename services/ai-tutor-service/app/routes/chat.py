"""
AI Chat Route — POST /api/ai/chat

Provides an AI-powered question-and-answer endpoint scoped to a specific
course. Clients send a message along with the conversation history so the
AI can provide contextually relevant answers.

Request body  : ChatRequest  { course_id, message, history }
Response body : ChatResponse { reply, course_id }

In production the handler calls a local LLM (e.g. Llama2 via Ollama)
passing the course content as system context. The current implementation
returns a descriptive placeholder response.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class ChatMessage(BaseModel):
    """A single turn in the conversation history."""

    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Request body for the AI chat endpoint."""

    course_id: int
    message: str
    history: List[ChatMessage] = []  # Previous conversation turns for context


class ChatResponse(BaseModel):
    """Response body returned by the AI chat endpoint."""

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
