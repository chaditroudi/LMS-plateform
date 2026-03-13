from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class TrendItem(BaseModel):
    label: str
    value: int


class DashboardStats(BaseModel):
    total_views: int
    total_enrollments: int
    active_users: int
    completion_rate: float
    popular_courses: List[TrendItem]
    enrollment_trends: List[TrendItem]


@router.get("/", response_model=DashboardStats)
async def get_dashboard():
    """
    Get analytics dashboard data.
    In production, this aggregates from PostgreSQL analytics table.
    Currently returns sample data.
    """
    return DashboardStats(
        total_views=15420,
        total_enrollments=3250,
        active_users=1890,
        completion_rate=68.5,
        popular_courses=[
            TrendItem(label="Introduction to Python", value=1250),
            TrendItem(label="Web Development with React", value=980),
            TrendItem(label="Data Science Fundamentals", value=750),
            TrendItem(label="DevOps & Cloud Computing", value=520),
            TrendItem(label="Machine Learning A-Z", value=410),
        ],
        enrollment_trends=[
            TrendItem(label="Jan", value=280),
            TrendItem(label="Feb", value=320),
            TrendItem(label="Mar", value=410),
            TrendItem(label="Apr", value=380),
            TrendItem(label="May", value=450),
            TrendItem(label="Jun", value=520),
        ],
    )
