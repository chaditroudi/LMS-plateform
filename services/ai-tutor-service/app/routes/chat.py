"""
AI Chat Route — POST /api/ai/chat

Provides an AI-powered question-and-answer endpoint scoped to a specific
course. Clients send a message along with the conversation history so the
AI can provide contextually relevant answers.

The handler fetches the course content from PostgreSQL, builds a system
prompt with course context, and calls the Ollama LLM for a real answer.
Falls back to a descriptive placeholder if Ollama is unavailable.
"""

import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.llm import chat_completion, is_groq_available
from app.database import get_course_context

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatMessage(BaseModel):
    """A single turn in the conversation history."""
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Request body for the AI chat endpoint."""
    course_id: int
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    """Response body returned by the AI chat endpoint."""
    reply: str
    course_id: int


SYSTEM_PROMPT_TEMPLATE = """You are an AI tutor. Help students understand this course:

{course_context}

Be concise, clear, and encouraging. Keep answers short (2-4 paragraphs max)."""


@router.post("", response_model=ChatResponse)
async def chat_with_tutor(request: ChatRequest):
    """
    AI-powered Q&A based on course content.
    Connects to Ollama LLM with course context for real answers.
    Falls back to placeholder if Ollama is unavailable.
    """
    # Check if Ollama is available
    if not await is_groq_available():
        logger.warning("OpenAI API key not configured")
        return ChatResponse(
            reply="The AI tutor is not configured. Please set the OPENAI_API_KEY.",
            course_id=request.course_id,
        )

    # Fetch course context from database
    course_context = get_course_context(request.course_id)
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(course_context=course_context)

    # Build message list from history + current message
    messages = [{"role": m.role, "content": m.content} for m in request.history]
    messages.append({"role": "user", "content": request.message})

    try:
        reply = await chat_completion(system_prompt, messages)
    except Exception as e:
        logger.error("LLM chat failed: %s", e)
        reply = (
            "I'm sorry, I encountered an error while processing your question. "
            "Please try again in a moment."
        )

    return ChatResponse(reply=reply, course_id=request.course_id)
