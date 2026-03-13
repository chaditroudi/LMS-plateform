from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

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
