from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class QuizGenerateRequest(BaseModel):
    course_id: int
    lesson_id: Optional[int] = None
    num_questions: int = 5


class QuizOption(BaseModel):
    label: str
    text: str
    is_correct: bool = False


class QuizQuestion(BaseModel):
    question: str
    options: List[QuizOption]
    explanation: str


class QuizResponse(BaseModel):
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
