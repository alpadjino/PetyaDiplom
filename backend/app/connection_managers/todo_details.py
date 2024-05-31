import asyncio
from uuid import UUID

from app.connection_managers.base import ConnectionManager


class TodoDetailsManager(ConnectionManager):
    async def broadcast(self, todo_data: dict) -> None:
        todo_id = UUID(todo_data["todo_id"])
        if todo_id not in self.connections.keys():
            return
        print(todo_id)
        async with asyncio.TaskGroup() as tg:
            for wbsct in self.connections[todo_id]:
                tg.create_task(wbsct.send_json(todo_data))
        return
