"""
Quiz Generation Route — POST /api/ai/quiz/generate

Generates multiple-choice quiz questions for a given course or lesson.
The number of questions is configurable (default 5, up to the number of
available sample questions).

Request body  : QuizGenerateRequest { course_id, lesson_id?, num_questions }
Response body : QuizResponse        { course_id, lesson_id, questions[] }

Each question includes:
  - question    : The question text.
  - options     : List of QuizOption (label A–D, text, is_correct flag).
  - explanation : Brief explanation of the correct answer.

In production this endpoint uses an LLM to generate questions dynamically
based on the actual lesson content. The current implementation returns a
fixed set of sample questions for demonstration purposes.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class QuizGenerateRequest(BaseModel):
    """Request body for quiz generation."""

    course_id: int
    lesson_id: Optional[int] = None  # Scope to a specific lesson when provided
    num_questions: int = 5


class QuizOption(BaseModel):
    """A single multiple-choice option for a quiz question."""

    label: str       # e.g. "A", "B", "C", "D"
    text: str
    is_correct: bool = False


class QuizQuestion(BaseModel):
    """A single quiz question with its options and explanation."""

    question: str
    options: List[QuizOption]
    explanation: str  # Shown to the learner after they answer


class QuizResponse(BaseModel):
    """Response body containing the generated quiz."""

    course_id: int
    lesson_id: Optional[int] = None
    questions: List[QuizQuestion]


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizGenerateRequest):
    """
    AI-powered quiz generation based on course/lesson content.
    In production, this uses LLM to generate contextual questions.
    Currently returns sample quiz questions.
    """
    sample_questions = [
        QuizQuestion(
            question="What is a variable in programming?",
            options=[
                QuizOption(label="A", text="A container for storing data values", is_correct=True),
                QuizOption(label="B", text="A type of loop"),
                QuizOption(label="C", text="A function definition"),
                QuizOption(label="D", text="An error message"),
            ],
            explanation="A variable is a named container used to store data values in memory.",
        ),
        QuizQuestion(
            question="Which keyword is used to define a function in Python?",
            options=[
                QuizOption(label="A", text="function"),
                QuizOption(label="B", text="func"),
                QuizOption(label="C", text="def", is_correct=True),
                QuizOption(label="D", text="define"),
            ],
            explanation="In Python, the 'def' keyword is used to define a function.",
        ),
        QuizQuestion(
            question="What does API stand for?",
            options=[
                QuizOption(label="A", text="Application Programming Interface", is_correct=True),
                QuizOption(label="B", text="Advanced Program Integration"),
                QuizOption(label="C", text="Automated Process Instruction"),
                QuizOption(label="D", text="Application Process Interface"),
            ],
            explanation="API stands for Application Programming Interface.",
        ),
    ]

    return QuizResponse(
        course_id=request.course_id,
        lesson_id=request.lesson_id,
        questions=sample_questions[:request.num_questions],
    )
