import asyncio
from uuid import UUID

from app.connection_managers.base import ConnectionManager
from app.models.todo_model import Todo
from app.models.user_model import User


class TodoRoomManager(ConnectionManager):
    async def broadcast(self, todo_id: UUID, sender_id: UUID) -> None:
        if todo_id not in self.connections.keys():
            return
        todo_info = await Todo.find_one(Todo.todo_id == todo_id)
        user_info = await User.find_one(User.user_id == sender_id)
        data = {"user": user_info.to_json(), "data": todo_info.to_json()}
        async with asyncio.TaskGroup() as tg:
            for wbsct in self.connections[todo_id]:
                tg.create_task(wbsct.send_json(data))
        return
