from typing import Optional
from uuid import UUID

import pymongo
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps.user_deps import get_current_user
from app.models.user_model import User
from app.schemas.user_schema import UserAuth, UserGroups, UserOut, UserUpdate
from app.services.todo_service import TodoService
from app.services.user_service import UserService

user_router = APIRouter()


@user_router.post("/create", summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth):
    try:
        return await UserService.create_user(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exist",
        )


@user_router.get(
    "/me", summary="Get details of currently logged in user", response_model=UserOut
)
async def get_me(user: User = Depends(get_current_user)):
    return user


@user_router.put("/update", summary="Update User", response_model=UserOut)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist"
        )


@user_router.get("/findUser", summary="Find User By ID", response_model=UserOut)
async def get_user_by_id(id: UUID) -> Optional[User]:
    user = await User.find_one(User.user_id == id)
    return user


@user_router.post(
    "/invite_to_group", summary="Invite User to Group", response_model=UserOut
)
async def invite_to_group(data: UserGroups):
    print("data: ", data.invited_user_id, data.group_id)
    try:
        # Проверяем существование пользователей
        invited_user = await User.find_one(User.user_id == data.invited_user_id)

        if not invited_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Добавляем group_id в список групп invited_user
        if data.group_id not in invited_user.groups:
            invited_user.groups.append(data.group_id)

        # Сохраняем изменения
        await invited_user.save()

        return invited_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_router.get(
    "/get_all_user_groups", summary="Get all user groups", response_model=list
)
async def get_user_groups_and_todos(user: User = Depends(get_current_user)):
    # try:
    todos_array = []
    # Найти пользователя, взять его группы, и вывести их
    # Нужно пройти по всем группам пользователя и получить полные данные из id.
    # Если имя группы новое, то создать новый ключ с тудушкой, если старое - в ключ с таким именем записать тудушку

    for group_id in user.groups:
        group_user = await User.find_one(User.user_id == group_id)
        todos = await TodoService.list_todos(group_user)  # [{}, {}]
        todos_array.append({"name": group_user.username, "todos": todos})

    return todos_array
    # Для каждой группы пользователя находим все связанные с ней задачи
    # for group_id in user.groups:
    #         # Получаем все тудушки для текущей группы
    #         todos = Todo.objects(group=group_id).all()

    #         # Формируем список тудушек для текущей группы
    #         todos_list = []
    #         for todo in todos:
    #             todo_data = {
    #                 "todo_id": str(todo.todo_id),
    #                 "status": todo.status,
    #                 "title": todo.title,
    #                 "description": todo.description,
    #                 "created_at": todo.created_at,
    #                 "updated_at": todo.updated_at
    #             }
    #             todos_list.append(todo_data)

    #         # Добавляем список тудушек текущей группы к словарю user_todos
    #         user_groups_and_todos[str(group_id)] = todos_list
    # return user_groups_and_todos


# except Exception as e:
#     raise HTTPException(status_code=400, detail=str(e))
