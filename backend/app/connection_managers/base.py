from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: dict[UUID, list[WebSocket]] = defaultdict(list)

    async def connect(self, _id: UUID, websocket: WebSocket):
        self.connections[_id].append(websocket)
        await websocket.accept()



    def disconnect(self, _id: UUID, websocket: WebSocket):
        self.connections[_id].remove(websocket)
