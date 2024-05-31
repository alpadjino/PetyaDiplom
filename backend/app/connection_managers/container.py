from app.connection_managers.todo_details import TodoDetailsManager
from app.connection_managers.user_todos import UserTodosManager


class ConnectionsContainer:
    user_todos = UserTodosManager()
    todo_details = TodoDetailsManager()


connections_container = ConnectionsContainer()
