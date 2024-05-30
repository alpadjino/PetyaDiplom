from datetime import datetime
from uuid import UUID, uuid4

from beanie import Document, Indexed, Insert, Link, Replace, before_event
from pydantic import Field

from .user_model import User


class Todo(Document):
    todo_id: UUID = Field(default_factory=uuid4, unique=True)
    status: bool = False
    title: Indexed(str)
    description: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    owner: Link[User]

    def _to_json(self) -> dict:
        model = self.model_dump()
        model["todo_id"] = str(model["todo_id"])
        model["created_at"] = str(model["created_at"])
        model["updated_at"] = str(model["updated_at"])
        return model

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
