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


@app.websocket("/ws/user/{user_id}")
async def connect_user(websocket: WebSocket, user_id: UUID):
    await connections_container.user_todos.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connections_container.user_todos.disconnect(user_id, websocket)


@app.websocket("/ws/todo/{todo_id}")
async def connect_user_to_room(websocket: WebSocket, todo_id: UUID):
    """Данный вебсокет открывает соединение юзера с тудушкой и следит за изменениями инфы в тудушке."""
    await connections_container.todo_details.connect(todo_id, websocket)
    try:
        while True:
            todo_data = await websocket.receive_json()
            await connections_container.todo_details.broadcast(todo_data)
            await connections_container.user_todos.broadcast(todo_data)
    except WebSocketDisconnect:
        connections_container.todo_details.disconnect(todo_id, websocket)


app.include_router(router, prefix=settings.API_V1_STR)
