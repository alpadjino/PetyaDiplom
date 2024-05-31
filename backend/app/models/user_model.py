from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from beanie import Indexed
from pydantic import EmailStr, Field

from app.models.base import BaseModel


class User(BaseModel):
    user_id: UUID = Field(default_factory=uuid4)
    username: Indexed(str, unique=True)  # type: ignore
    email: Indexed(EmailStr, unique=True)  # type: ignore
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    disabled: Optional[bool] = None
    groups: List[UUID] = []
    # List[UUID] = Field(default=[])

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False

    @property
    def create(self) -> datetime:
        return self.id.generation_time

    @classmethod
    async def by_email(self, email: str) -> "User":
        return await self.find_one(self.email == email)

    class settings:
        name = "users"
