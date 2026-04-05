"""
Recommendation Route — POST /api/ai/recommendations

Returns a personalised list of recommended courses for a given user.
The recommendation engine considers:
  - The user's declared interests.
  - The course they are currently enrolled in (if any).
  - Their overall learning progression.

Request body  : RecommendationRequest  { user_id, current_course_id?, interests[] }
Response body : RecommendationResponse { user_id, recommendations[] }

Each recommendation includes a course_id, human-readable title, a reason
explaining why it was recommended, and a relevance score (0.0–1.0).

In production this endpoint uses an LLM / collaborative-filtering model to
produce truly personalised results. The current implementation returns a
fixed sample list for demonstration purposes.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class RecommendationRequest(BaseModel):
    """Request body for the course recommendation endpoint."""

    user_id: str
    current_course_id: Optional[int] = None  # Course the user is currently studying
    interests: List[str] = []               # User-declared topic interests


class CourseRecommendation(BaseModel):
    """A single recommended course with its relevance score and reason."""

    course_id: int
    title: str
    reason: str    # Human-readable explanation surfaced in the UI
    score: float   # Relevance score in [0.0, 1.0]


class RecommendationResponse(BaseModel):
    """Response body containing the recommendation list for a user."""

    user_id: str
    recommendations: List[CourseRecommendation]


@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    AI-powered course recommendations.
    In production, this analyzes user progress and interests using LLM.
    Currently returns sample recommendations.
    """
    sample_recommendations = [
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

    return RecommendationResponse(
        user_id=request.user_id,
        recommendations=sample_recommendations,
    )
