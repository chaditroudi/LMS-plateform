from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Review, Course
from app.schemas import ReviewCreate, ReviewResponse

router = APIRouter()


@router.post("/{course_id}/reviews", response_model=ReviewResponse, status_code=201)
def create_review(course_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = db.query(Review).filter(
        Review.user_id == review.user_id, Review.course_id == course_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Review already exists")

    db_review = Review(course_id=course_id, **review.model_dump())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@router.get("/{course_id}/reviews", response_model=List[ReviewResponse])
def list_reviews(course_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.course_id == course_id).all()
