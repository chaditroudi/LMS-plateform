"""
LLM Client — Groq Integration (OpenAI-compatible)

Provides async helpers to interact with the Groq API for:
  - Chat completions (multi-turn conversation)
  - Text generation (single prompt, e.g. quiz / recommendations)
  - JSON generation (structured output with retry/parse)

Environment variables:
  GROQ_API_KEY — Your Groq API key
  LLM_MODEL    — Model name to use (default: llama-3.3-70b-versatile)
"""

import os
import json
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")

client = AsyncOpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
) if GROQ_API_KEY else None


async def chat_completion(
    system_prompt: str,
    messages: list[dict],
    temperature: float = 0.7,
) -> str:
    """
    Send a multi-turn chat to Groq and return the assistant reply.
    """
    if not client:
        return "AI tutor is not configured. Please set the GROQ_API_KEY."

    openai_messages = [{"role": "system", "content": system_prompt}]
    openai_messages.extend(messages)

    try:
        resp = await client.chat.completions.create(
            model=LLM_MODEL,
            messages=openai_messages,
            temperature=temperature,
            max_tokens=512,
        )
        return resp.choices[0].message.content or "I'm sorry, I couldn't generate a response."
    except Exception as e:
        logger.error("Groq chat failed: %s", e)
        raise


async def generate_text(prompt: str, temperature: float = 0.7) -> str:
    """
    Single-prompt text generation via Groq chat completions.
    """
    if not client:
        return ""

    try:
        resp = await client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=1024,
        )
        return resp.choices[0].message.content or ""
    except Exception as e:
        logger.error("Groq generate failed: %s", e)
        return ""


async def generate_json(prompt: str, temperature: float = 0.3) -> dict | list | None:
    """
    Generate a response and parse it as JSON.
    Uses response_format for structured output.
    """
    if not client:
        return None

    try:
        resp = await client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content or ""
    except Exception as e:
        logger.error("Groq JSON generation failed: %s", e)
        return None

    # Try to extract JSON from the response
    text = raw.strip()
    if "```json" in text:
        text = text.split("```json", 1)[1]
        text = text.split("```", 1)[0]
    elif "```" in text:
        text = text.split("```", 1)[1]
        text = text.split("```", 1)[0]

    try:
        parsed = json.loads(text.strip())
        # If the model wraps the array in an object, try to extract it
        if isinstance(parsed, dict) and len(parsed) == 1:
            val = next(iter(parsed.values()))
            if isinstance(val, list):
                return val
        return parsed
    except json.JSONDecodeError:
        logger.warning("Failed to parse Groq JSON output: %s", text[:200])
        return None


async def is_groq_available() -> bool:
    """Health check — returns True if Groq API key is configured."""
    return bool(client)
