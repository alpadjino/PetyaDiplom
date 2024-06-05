import { Box, Button, Center, Flex, Spinner, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { AddUpdateTodoModal } from "./AddUpdateTodoModal";
import { TodoCard } from "./TodoCard";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggler } from "../Theme/ThemeToggler";

import styles from './TodoList.module.css'
import { UserInfo } from "../Navbar/UserInfo/UserInfo";
import { Outlet } from "react-router-dom";
import { AddToGroupModal } from "./AddToGroupModal";
import { OtherTodo } from "./OtherTodo";
import { useIsMobileContext } from "../../context/IsMobileContext";

export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [otherTodos, setOtherTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ setLoad ] = useState(true);

  const [websckt, setWebsckt] = useState();
  
  const { logout, user } = useAuth();
  const { isMobile } = useIsMobileContext();


  useEffect(() => {}, [isMobile])

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
          console.log("item",item)
          return {
            ...item,
            todos: item.todos.map((todo) =>
              todo.todo_id === message.todo_id ? message : todo
            ),
          };
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
        bg={useColorModeValue("#EDECE9", "gray.800")}
      >
        <Flex flexDirection={"column"} gap={"10px"} width={"100%"}>
          <UserInfo />
        </Flex>

        <Flex flexDirection={"column"} >
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
            <Box className={styles.todoLeftList} width={"100%"}>
              {todos?.map((todo) => (
                <TodoCard
                  todo={todo}
                  key={todo?.todo_id}
                  setLoading={setLoading}
                  todos={todos}
                  setTodos={setTodos}
                />
              ))}

              <OtherTodo
                otherTodo={otherTodos}
                todos={todos}
                setLoading={setLoad}
              />
            </Box>
          )}
        </Flex>
        <Flex
          flexDirection={"column"}
          position={"sticky"}
          bottom={0}
          bgColor={"#aeaca6"}
          justifyContent={"center"}
          w={"100%"}
        >
          <Flex
            flexDirection={"row"}
            gap={"10px"}
            width={"100%"}
            paddingTop={"10px"}
            justifyContent={"space-between"}
          >
            <AddUpdateTodoModal onSuccess={fetchTodos} />
            <AddToGroupModal />
          </Flex>
          <Box className={styles.leftListBottom} bg={"transparent"}>
            <ThemeToggler size="lg" />
            <Button
              onClick={logout}
              colorScheme="none"
              color={useColorModeValue("black", "white")}
              _hover={{
                backgroundColor: "#aeaca63e",
              }}
            >
              Выйти
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Outlet />
    </Flex>
  );
};
