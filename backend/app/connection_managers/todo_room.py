import asyncio
from uuid import UUID

from app.connection_managers.base import ConnectionManager
from app.models.todo_model import Todo
from app.models.user_model import User


class TodoRoomManager(ConnectionManager):
    async def broadcast(self, todo_data: dict, sender_id: UUID) -> None:
        todo_id = UUID(todo_data["todo_id"])
        if todo_id not in self.connections.keys():
            return
        # todo_info = await Todo.find_one(Todo.todo_id == todo_id)
        # user_info = await User.find_one(User.user_id == sender_id)
        print(todo_id)
        async with asyncio.TaskGroup() as tg:
            for wbsct in self.connections[todo_id]:
                tg.create_task(wbsct.send_json(todo_data))
        return
