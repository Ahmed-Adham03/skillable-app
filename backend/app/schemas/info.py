from pydantic import BaseModel, Field


class InfoSave(BaseModel):
    question_index: int = Field(..., ge=1, le=5)
    answer: str = Field(..., max_length=500)
