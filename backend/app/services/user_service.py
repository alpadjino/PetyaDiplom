from typing import AsyncGenerator, Optional
from uuid import UUID

import pymongo
from bson import ObjectId

from app.core.security import get_password, verify_password
from app.models.user_model import User
from app.models.todo_model import Todo
from app.schemas.user_schema import UserAuth, UserUpdate


class UserService:
    @staticmethod
    async def create_user(user: UserAuth):
        user_in = User(
            username=user.username,
            email=user.email,
            hashed_password=get_password(user.password),
        )

        await user_in.save()
        return user_in

    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[User]:
        user = await UserService.get_user_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_pass=user.hashed_password):
            return None

        return user

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        user = await User.find_one(User.email == email)
        return user

    @staticmethod
    async def get_user_by_user_id(id: UUID) -> Optional[User]:
        user = await User.find_one(User.user_id == id)
        return user

    @staticmethod
    async def update_user(id: UUID, data: UserUpdate) -> User:
        user = await User.find_one(User.user_id == id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")

        await user.update({"$set": data.dict(exclude_unset=True)})
        return user

    @staticmethod
    async def get_members_by_owner_id(owner_id: UUID | str) -> AsyncGenerator[User, None]:
        if isinstance(owner_id, str):
            owner_id = UUID(owner_id)
        query = {"groups": owner_id}
        users = User.find(query)
        return [user async for user in users]

    @staticmethod
    async def get_user_by_id(_id: ObjectId | str):
        _id = ObjectId(_id)
        return await User.find_one(User.id == _id)
