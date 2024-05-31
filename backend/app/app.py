from uuid import UUID

from beanie import init_beanie
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.api.api_v1.router import router
from app.connection_managers.container import connections_container
from app.core.config import settings
from app.models.todo_model import Todo
from app.models.user_model import User

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def app_init():
    """
    initialize crucial application services
    """

    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).FODOIST
    await init_beanie(database=db_client, document_models=[User, Todo])


@app.websocket("/ws/{user_id}")
async def connect_user(websocket: WebSocket, user_id: UUID):
    await websocket.accept()
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        return


@app.websocket("/ws/{user_id}/{room_id}")
async def connect_user_to_room(websocket: WebSocket, user_id: UUID, room_id: UUID):
    """Данный вебсокет открывает соединение юзера с тудушкой и следит за изменениями инфы в тудушке."""
    await connections_container.todo_rooms.connect(room_id, websocket)
    print(websocket)
    try:
        while True:
            todo_data = await websocket.receive_json()
            await connections_container.todo_rooms.broadcast(todo_data, user_id)
    except WebSocketDisconnect:
        connections_container.todo_rooms.disconnect(room_id, websocket)


app.include_router(router, prefix=settings.API_V1_STR)
