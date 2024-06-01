import { Box, Button, Center, Container, Flex, Spinner, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { AddUpdateTodoModal } from "./AddUpdateTodoModal";
import { TodoCard } from "./TodoCard";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggler } from "../Theme/ThemeToggler";

import styles from './TodoList.module.css'
import { UserInfo } from "../Navbar/UserInfo/UserInfo";
import { Outlet, useNavigate } from "react-router-dom";
import { AddToGroupModal } from "./AddToGroupModal";
import { OtherTodo } from "./OtherTodo";
import { useIsMobileContext } from "../../context/IsMobileContext";

export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [otherTodos, setOtherTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const isMounted = useRef(false);

  const [websckt, setWebsckt] = useState();
  
  const { logout, user } = useAuth();
  const { isMobile } = useIsMobileContext();


  useEffect(() => {
    fetchTodos();
    const url = `ws://localhost:8000/ws/user/${user.user_id}`;
    const ws = new WebSocket(url);

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log("GENERAL", message);
      setTodos((prev) =>
        prev.map((res) => {
          if (res.todo_id === message.todo_id) return message;

          return res;
        })
      );
    setOtherTodos((prev) =>
      prev.map((item) => {
        if (message.name) {
          console.log("item",item)
          return {
            ...item,
            todos: item.todos.map((todo) =>
              todo.todo_id === message.todo_id ? message : todo
            ),
          };
        }
        return item;
      })
    );
    };

    setWebsckt(ws);

    return () => {
      ws.close();
      console.log("Сломався");
      setLoading(true);
    };
  }, []);

  const fetchTodos = () => {
    setLoading(true);
    axiosInstance
      .get("/todo/")
      .then((res) => {
        setTodos(res.data);
      })
      .then(async () => 
        await axiosInstance.get("/users/get_all_user_groups")
        .then((res) => {
          console.log("other",res.data);
          setOtherTodos(res.data);
        })
        .catch((error) => {
          console.error(error);
        }))
      .finally(() => {
        setLoading(false);
      })
  };

  return (
    <Flex
      sx={{
        width: "100vw",
      }}
    >
      <Flex
        className={styles.todoListContainer}
        display={isMobile ? "none" : "flex"}
        bg={useColorModeValue("gray.100", "gray.200")}
      >
        <Flex flexDirection={"column"} gap={"10px"} width={"100%"}>
          <UserInfo />
          <AddUpdateTodoModal onSuccess={fetchTodos} />
          <AddToGroupModal />
        </Flex>
        {loading ? (
          <Center mt={6}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="green.200"
              color="green.500"
              size="xl"
            />
          </Center>
        ) : (
          <Box className={styles.todoLeftList} mt={6}>
            {todos?.map((todo) => (
              <TodoCard
                todo={todo}
                key={todo.todo_id}
                setLoading={setLoading}
              />
            ))}

            <OtherTodo otherTodo={otherTodos} setLoading={setLoad} />
            
          </Box>
        )}

        <Box className={styles.leftListBottom}>
          <ThemeToggler size="lg" />
          <Button onClick={logout} colorScheme="green">
            Выйти
          </Button>
        </Box>
      </Flex>

      <Outlet />
    </Flex>
  );
};
