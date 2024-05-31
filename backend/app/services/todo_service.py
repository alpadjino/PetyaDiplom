from typing import List
from uuid import UUID

from fastapi.exceptions import HTTPException

from app.models.todo_model import Todo
from app.models.user_model import User
from app.schemas.todo_schema import TodoCreate, TodoUpdate


class TodoService:
    @staticmethod
    async def list_todos(user: User) -> List[Todo]:
        todos = await Todo.find(Todo.owner.id == user.id).to_list()
        return todos

    @staticmethod
    async def create_todo(user: User, data: TodoCreate) -> Todo:
        todo = Todo(**data.dict(), owner=user)
        return await todo.insert()

    @staticmethod
    async def retrieve_todo(todo_id: UUID):
        todo = await Todo.find_one(Todo.todo_id == todo_id)
        return todo

    @staticmethod
    async def update_todo(current_user: User, todo_id: UUID, data: TodoUpdate):
        todo = await TodoService.retrieve_todo(todo_id)

        if todo is None:
            raise HTTPException(404, "No todo found")
        await todo.update({"$set": data.dict(exclude_unset=True)})

        await todo.save()
        return todo

    @staticmethod
    async def delete_todo(current_user: User, todo_id: UUID) -> None:
        todo = await TodoService.retrieve_todo(todo_id)
        if todo:
            await todo.delete()

        return None
