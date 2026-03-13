from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Enrollment, Course, Progress, Lesson
from app.schemas import EnrollmentCreate, EnrollmentResponse, ProgressUpdate, ProgressResponse

router = APIRouter()


@router.post("/{course_id}/enroll", response_model=EnrollmentResponse, status_code=201)
def enroll_in_course(course_id: int, enrollment: EnrollmentCreate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = db.query(Enrollment).filter(
        Enrollment.user_id == enrollment.user_id,
        Enrollment.course_id == course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already enrolled")

    db_enrollment = Enrollment(user_id=enrollment.user_id, course_id=course_id)
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment


@router.get("/{course_id}/enrollments", response_model=List[EnrollmentResponse])
def list_enrollments(course_id: int, db: Session = Depends(get_db)):
    return db.query(Enrollment).filter(Enrollment.course_id == course_id).all()


@router.get("/user/{user_id}/enrollments", response_model=List[EnrollmentResponse])
def get_user_enrollments(user_id: str, db: Session = Depends(get_db)):
    return db.query(Enrollment).filter(Enrollment.user_id == user_id).all()


@router.put("/{course_id}/lessons/{lesson_id}/progress", response_model=ProgressResponse)
def update_progress(
    course_id: int,
    lesson_id: int,
    progress_data: ProgressUpdate,
    user_id: str = "",
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id query parameter required")

    lesson = db.query(Lesson).filter(
        Lesson.id == lesson_id, Lesson.course_id == course_id
    ).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    progress = db.query(Progress).filter(
        Progress.user_id == user_id, Progress.lesson_id == lesson_id
    ).first()

    if progress:
        progress.completed = progress_data.completed
        progress.completed_at = datetime.utcnow() if progress_data.completed else None
    else:
        progress = Progress(
            user_id=user_id,
            lesson_id=lesson_id,
            course_id=course_id,
            completed=progress_data.completed,
            completed_at=datetime.utcnow() if progress_data.completed else None,
        )
        db.add(progress)

    db.commit()
    db.refresh(progress)
    return progress


@router.get("/{course_id}/progress/{user_id}", response_model=List[ProgressResponse])
def get_user_progress(course_id: int, user_id: str, db: Session = Depends(get_db)):
    return db.query(Progress).filter(
        Progress.user_id == user_id, Progress.course_id == course_id
    ).all()
