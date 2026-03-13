from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import events, dashboard

app = FastAPI(
    title="LMS Analytics Service",
    description="Track views, enrollments, and learning trends",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router, prefix="/api/analytics/events", tags=["events"])
app.include_router(dashboard.router, prefix="/api/analytics/dashboard", tags=["dashboard"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "analytics-service"}
