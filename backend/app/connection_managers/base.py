from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: dict[UUID, list[WebSocket]] = defaultdict(list)

    async def connect(self, _id: UUID, websocket: WebSocket):
        await websocket.accept()
        self.connections[_id].append(websocket)
        print(self.connections)

    def disconnect(self, _id: UUID, websocket: WebSocket):
        self.connections[_id].remove(websocket)
        print(self.connections)
