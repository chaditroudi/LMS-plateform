from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Course schemas
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float = 0.0
    is_free: bool = True
    thumbnail_url: Optional[str] = None


class CourseCreate(CourseBase):
    instructor_id: str


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    is_free: Optional[bool] = None
    thumbnail_url: Optional[str] = None


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    order_index: int
    duration_minutes: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class CourseResponse(CourseBase):
    id: int
    instructor_id: str
    created_at: datetime
    updated_at: datetime
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True


class CourseListResponse(CourseBase):
    id: int
    instructor_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Lesson schemas
class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    order_index: int
    duration_minutes: int = 0


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    order_index: Optional[int] = None
    duration_minutes: Optional[int] = None


# Enrollment schemas
class EnrollmentCreate(BaseModel):
    user_id: str


class EnrollmentResponse(BaseModel):
    id: int
    user_id: str
    course_id: int
    enrolled_at: datetime

    class Config:
        from_attributes = True


# Progress schemas
class ProgressUpdate(BaseModel):
    completed: bool = True


class ProgressResponse(BaseModel):
    id: int
    user_id: str
    lesson_id: int
    course_id: int
    completed: bool
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Review schemas
class ReviewCreate(BaseModel):
    user_id: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    user_id: str
    course_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
