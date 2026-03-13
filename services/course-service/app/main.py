from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import courses, lessons, enrollments, reviews
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LMS Course Service",
    description="Course management, lessons, enrollments, and search",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(lessons.router, prefix="/api/courses", tags=["lessons"])
app.include_router(enrollments.router, prefix="/api/courses", tags=["enrollments"])
app.include_router(reviews.router, prefix="/api/courses", tags=["reviews"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "course-service"}
