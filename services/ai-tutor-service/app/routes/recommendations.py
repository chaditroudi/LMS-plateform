"""
Recommendation Route — POST /api/ai/recommendations

Returns a personalised list of recommended courses for a given user using
the Ollama LLM. Falls back to sample recommendations if LLM is unavailable.
"""

import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

from app.llm import generate_json, is_groq_available
from app.database import get_all_courses_summary

logger = logging.getLogger(__name__)

router = APIRouter()


class RecommendationRequest(BaseModel):
    user_id: str
    current_course_id: Optional[int] = None
    interests: List[str] = []


class CourseRecommendation(BaseModel):
    course_id: int
    title: str
    reason: str
    score: float


class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[CourseRecommendation]


RECOMMENDATION_PROMPT_TEMPLATE = """You are an AI course recommendation engine for an online learning platform.
Based on the user's interests and the available courses, recommend the most relevant courses.

User Interests: {interests}
Currently Studying Course ID: {current_course_id}

Available Courses:
{courses_summary}

Return ONLY a valid JSON array with this exact structure (no other text):
[
  {{
    "course_id": 1,
    "title": "Course Title",
    "reason": "Why this course is recommended",
    "score": 0.95
  }}
]

Rules:
- Recommend up to 5 courses, ranked by relevance (highest score first).
- Score should be between 0.0 and 1.0.
- Do NOT recommend the course the user is currently studying.
- Provide a clear, personalised reason for each recommendation.
- Return ONLY the JSON array, no markdown, no extra text."""


def _fallback_recommendations() -> List[CourseRecommendation]:
    return [
        CourseRecommendation(
            course_id=1,
            title="Introduction to Python",
            reason="Based on your interest in programming fundamentals",
            score=0.95,
        ),
        CourseRecommendation(
            course_id=3,
            title="Data Science Fundamentals",
            reason="Complements your current learning path",
            score=0.87,
        ),
        CourseRecommendation(
            course_id=5,
            title="Machine Learning A-Z",
            reason="Advanced topic matching your skill progression",
            score=0.82,
        ),
    ]


@router.post("", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    AI-powered course recommendations.
    Uses Ollama LLM to analyse user profile and course catalogue.
    Falls back to sample recommendations if unavailable.
    """
    if not await is_groq_available():
        logger.warning("Ollama unavailable, returning fallback recommendations")
        return RecommendationResponse(
            user_id=request.user_id,
            recommendations=_fallback_recommendations(),
        )

    courses_summary = get_all_courses_summary()
    interests = ", ".join(request.interests) if request.interests else "General learning"

    prompt = RECOMMENDATION_PROMPT_TEMPLATE.format(
        interests=interests,
        current_course_id=request.current_course_id or "None",
        courses_summary=courses_summary,
    )

    try:
        parsed = await generate_json(prompt)
        if parsed and isinstance(parsed, list):
            recommendations = []
            for r in parsed[:5]:
                recommendations.append(
                    CourseRecommendation(
                        course_id=r.get("course_id", 0),
                        title=r.get("title", "Unknown"),
                        reason=r.get("reason", "Recommended for you"),
                        score=min(max(float(r.get("score", 0.5)), 0.0), 1.0),
                    )
                )
            if recommendations:
                return RecommendationResponse(
                    user_id=request.user_id,
                    recommendations=recommendations,
                )
    except Exception as e:
        logger.error("LLM recommendation failed: %s", e)

    return RecommendationResponse(
        user_id=request.user_id,
        recommendations=_fallback_recommendations(),
    )
