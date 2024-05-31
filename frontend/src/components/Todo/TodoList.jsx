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

export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [otherTodos, setOtherTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const isMounted = useRef(false);
  
  const { logout, user } = useAuth();

  const [websckt, setWebsckt] = useState();
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const url = "ws://localhost:8000/ws/" + user.user_id;
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      ws.send("Connect");
    };

    // recieve message every start page
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages([...messages, message]);
    };

    setWebsckt(ws);
    //clean up function when we close page
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (isMounted.current) return;
    fetchTodos();
    isMounted.current = true;
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
          console.log(res.data);
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
        bg={useColorModeValue("gray.100", "gray.200")}
      >
        <Flex flexDirection={"column"} height="100%" gap={"10px"} width={"100%"}>
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

            {/* {otherTodos.map((todo) => {
              return (
                <>
                  <Text key={todo.name}>{todo.name}</Text>
                  {todo.todos.map((todoData) => (
                    <TodoCard
                      todo={todoData}
                      key={todo.todo_id}
                    />
                  ))}
                </>
              )
            })} */}
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
