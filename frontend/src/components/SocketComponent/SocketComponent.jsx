import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000/"; // URL вашего сервера FastAPI

const SocketComponent = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Создаем экземпляр сокета и храним его в состоянии
    const newSocket = io(SOCKET_URL, { path: "/socket.io/" });
    setSocket(newSocket);

    // Обработчик события подключения
    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Обработчик события отключения
    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Очистка при размонтировании компонента
    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <h1>Socket.IO with React</h1>
    </div>
  );
};

export default SocketComponent;
