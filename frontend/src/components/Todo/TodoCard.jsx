import { Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, useToast, Box, Button, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";
import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useTodoContext } from "../../context/TodoIsOpenContext";
import { GrStatusGoodSmall } from "react-icons/gr";

import axiosInstance from "../../services/axios";
import { useState } from "react";
import { todoSave, todoUpdate } from "../../utils/apiFunctions";
import { useAuth } from "../../hooks/useAuth";
import { useIsMobileContext } from "../../context/IsMobileContext";

export const TodoCard = ({ todo, setLoading, todos, setTodos }) => {
  const { todoOpen, setTodoOpen } = useTodoContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [rename, setRename] = useState(todo?.title);
  const [isRename, setIsRename] = useState(false);

  const { setIsMobile, defaultValue } = useIsMobileContext();

const handleRename = (event) => {
  setRename(event.target.value);
  const newTitle = event.target.value;


  // Обновляем состояние задач в общем списке
  setTodos((prevTodos) =>
    prevTodos.map((prevTodo) =>
      prevTodo.todo_id === todo.todo_id
        ? { ...prevTodo, title: newTitle }
        : prevTodo
    )
  );

};

const handleStatusChange = async (e) => {
  e.stopPropagation();

  setTodos((prevTodos) =>
    prevTodos.map((prevTodo) => {
      if (prevTodo.todo_id === todo.todo_id) {
        if (prevTodo.status > 2) {
          // Если статус больше 2, обновляем его на 1
          todoUpdate({
            todoId: prevTodo.todo_id,
            data: { ...prevTodo, status: 1 },
          });
          return { ...prevTodo, status: 1 };
        } else {
          // Иначе увеличиваем статус на 1
          const newStatus = prevTodo.status + 1;
          todoUpdate({
            todoId: prevTodo.todo_id,
            data: { ...prevTodo, status: newStatus },
          });
          return { ...prevTodo, status: newStatus };
        }
      }
      return prevTodo;
    })
  );
};

  const delateTodo = () => {
    setLoading(true);
    navigate("/");
    setTodoOpen(null);
    
    axiosInstance
      .delete(`/todo/${todo.todo_id}`)
      .then(() => {
        setTodoOpen(null);
        toast({
          title: "Успешно удален",
          status: "success",
          isClosable: true,
          diration: 1500,
        });
        navigate("/");
        setTodos(
          todos.filter((countTodo) => countTodo.todo_id !== todo.todo_id)
        );
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Ошибка удаления",
          status: "error",
          isClosable: true,
          diration: 2000,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleDuplicate = () => {
    todoSave(todo);
    setTodos((todos) => [...todos, todo]);
    toast({
      description: `Группа ${todo.title} дублирована`,
      status: "success",
    })
  }

  return (
    <Box>
      <Flex
        bg={"transparent"}
        color={useColorModeValue("black", "white")}
        minHeight="3rem"
        my={3}
        p={3}
        rounded="lg"
        alignItems="center"
        justifyContent="space-between"
        width={"100%"}
        _hover={{
          opacity: 0.9,
          cursor: "pointer",
          backgroundColor: "#aeaca63e",
        }}
        onClick={() => {
          if (!isRename) {
            console.log(todoOpen);
            if (
              todoOpen?.todo_id === todo?.todo_id &&
              window.location.pathname === "/"
            )
              return;

            if (todoOpen === null) {
              if (defaultValue === true) setIsMobile(defaultValue);
              navigate(`todos/${todo?.todo_id}`);
            } else if (todoOpen?.todo_id === todo?.todo_id) {
              todoUpdate({ todoId: todo?.todo_id, data: todoOpen });
              if (defaultValue === true) setIsMobile(!defaultValue);
              navigate("/");
            } else {
              todoUpdate({ todoId: todoOpen?.todo_id, data: todoOpen });
              setTodoOpen(null);
              navigate(`/todos/${todo?.todo_id}`);
            }
          }
        }}
      >
        <Flex alignItems={"center"} gap={"10px"}>
          {!isRename && <IoIosDocument />}
          {isRename ? (
            <Flex gap={"10px"}>
              <Input
                defaultValue={todo?.title}
                value={rename}
                onChange={(e) => handleRename(e)}
              />
              <Button
                onClick={() => {
                  todoUpdate({
                    todoId: todo?.todo_id,
                    data: {
                      ...todo,
                      title: rename,
                    },
                  });
                  setIsRename(!isRename);
                }}
              >
                <CheckIcon />
              </Button>
            </Flex>
          ) : (
            <Text textOverflow={"ellipsis"} whiteSpace={"nowrap"} maxW={"90px"} overflow={"hidden"}>
              {todo?.title}
            </Text>
          )}
        </Flex>
        {!isRename && (
          <Flex alignItems={"center"} gap={"5px"} justifyContent={"flex-end"}>
            <Button
              colorScheme="none"
              onClick={(e) => handleStatusChange(e)}
              color={
                todo?.status === 0
                  ? "gray"
                  : todo?.status === 1
                  ? "yellow"
                  : todo?.status === 2
                  ? "green"
                  : "gray"
              }
            >
              <GrStatusGoodSmall />
            </Button>
            <Flex>
              {todo?.owner?.id == user?._id && (
                <Menu>
                  <MenuButton
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Options"
                    variant="outline"
                    padding={"10px"}
                    borderRadius={"10px"}
                    _hover={{ backgroundColor: "gray.200", color: "black" }}
                  >
                    <BsThreeDotsVertical />
                  </MenuButton>
                  <MenuList position={"absolute"} zIndex={"100"}>
                    <MenuItem icon={<IoCopy />} onClick={handleDuplicate}>
                      Дублировать
                    </MenuItem>
                    <>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsRename(!isRename);
                          navigate("/");
                          setTodoOpen(null); 
                        }}
                      >
                        Переименовать
                      </MenuItem>
                      <MenuItem icon={<DeleteIcon />} onClick={delateTodo}>
                        Удалить
                      </MenuItem>
                    </>
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
