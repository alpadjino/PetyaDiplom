from datetime import datetime
from uuid import UUID, uuid4

from beanie import Indexed, Insert, Link, Replace, before_event
from pydantic import Field

from app.models.base import BaseModel

from .user_model import User


class Todo(BaseModel):
    todo_id: UUID = Field(default_factory=uuid4, unique=True)
    status: bool = False
    title: Indexed(str)  # type: ignore
    description: dict | None = {
            'time': 1643195431504,
            'blocks': [
              {
                'id': "o72AO0sY-1",
                'type': "paragraph",
                'data': {
                  'text': "Начните тут",
                },
              },
            ],
          }
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    owner: Link[User]

    def __repr__(self) -> str:
        return f"<Todo {self.title}>"

    def __str__(self) -> str:
        return self.title

    def __hash__(self) -> int:
        return hash(self.title)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Todo):
            return self.todo_id == other.todo_id
        return False

    @before_event([Replace, Insert])
    def update_update_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "todos"
