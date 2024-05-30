from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[UUID, list[WebSocket]] = defaultdict(list)

    async def connect(self, user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id].append(websocket)
        print(self.active_connections)

    def disconnect(self, user_id: UUID, websocket: WebSocket):
        self.active_connections[user_id].remove(websocket)
        print(self.active_connections)
