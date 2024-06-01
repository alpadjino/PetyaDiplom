import asyncio
from uuid import UUID
from bson import ObjectId

from app.connection_managers.base import ConnectionManager
from app.services.user_service import UserService


class UserTodosManager(ConnectionManager):
    async def broadcast(self, todo_data: dict) -> None:
        owner_id = ObjectId(todo_data["owner"]["id"])
        owner_user_id = (await UserService.get_user_by_id(owner_id)).user_id
        users = await UserService.get_members_by_owner_id(owner_user_id)
        async with asyncio.TaskGroup() as tg:
            if owner_user_id in self.connections.keys():
                for websocket in self.connections[owner_user_id]:
                    tg.create_task(websocket.send_json(todo_data))
            for user in users:
                if user.user_id in self.connections.keys():
                    for websocket in self.connections[user.user_id]:
                        tg.create_task(websocket.send_json(todo_data))
        return
