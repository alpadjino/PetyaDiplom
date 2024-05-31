import asyncio
from uuid import UUID

from app.connection_managers.base import ConnectionManager
from app.services.user_service import UserService


class UserTodosManager(ConnectionManager):
    async def broadcast(self, todo_data: dict) -> None:
        todo_id = UUID(todo_data["todo_id"])
        users = await UserService.get_users_by_todo_id(todo_id)
        async with asyncio.TaskGroup() as tg:
            async for user in users:
                if user.user_id in self.connections.keys():
                    websocket = self.connections[user.user_id]
                    tg.create_task(websocket.send_json(todo_data))
        return
