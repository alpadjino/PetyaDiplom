from app.connection_managers.todo_room import TodoRoomManager


class ConnectionsContainer:
    todo_rooms = TodoRoomManager()


connections_container = ConnectionsContainer()
