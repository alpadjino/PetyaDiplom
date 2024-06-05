from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TodoCreate(BaseModel):
    title: str = Field(..., title="Title", max_length=755, min_length=1)
    description: dict = Field(..., title="Title")
    status: Optional[int]


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(..., title="Title", max_length=755, min_length=1)
    description: Optional[dict] = Field(..., title="Title")
    status: Optional[int]
    
class TodoOut(BaseModel):
    todo_id: UUID
    status: int
    title: str
    description: dict
    created_at: datetime
    updated_at: datetime