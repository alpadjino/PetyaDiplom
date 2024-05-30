import { Badge, Flex, Menu, MenuButton, MenuItem, MenuList, Text, Container, Center, Spinner, useColorModeValue, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";
import { AddIcon, DeleteIcon, EditIcon, ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { useTodoContext } from "../../context/TodoIsOpenContext";

import axiosInstance from "../../services/axios";
import { useEffect, useState } from "react";
import { todoUpdate } from "../../utils/apiFunctions";
import { useAuth } from "../../hooks/useAuth";

export const TodoCard = ({ todo, setLoading }) => {
  const { todoOpen, setTodoOpen } = useTodoContext();
  const { user } = useAuth();

  const navigate = useNavigate();
  const toast = useToast();

  const delateTodo = () => {
    setLoading(true);
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

  return (
    <Flex
      bg={useColorModeValue("gray.300", "gray.600")}
      minHeight="3rem"
      my={3}
      p={3}
      rounded="lg"
      alignItems="center"
      justifyContent="space-between"
      _hover={{
        opacity: 0.9,
        cursor: "pointer",
        transform: "translateY(-3px)",
      }}
      onClick={() => {
        if (todoOpen === null) {
          setTodoOpen(todo);
          navigate(`todos/${todo.todo_id}`);
        } else if (todoOpen.todo_id === todo.todo_id) {
          todoUpdate({ todoId: todo.todo_id, data: todoOpen });
          setTodoOpen(null);
          navigate("/");
        } else {
          todoUpdate({ todoId: todoOpen.todo_id, data: todoOpen });
          navigate(`/todos/${todo.todo_id}`);
          setTodoOpen(todo);
        }
      }}
    >
      <Flex alignItems={"center"} gap={"10px"}>
        <IoIosDocument />
        <Text>
          {todoOpen?.todo_id === todo.todo_id ? todoOpen.title : todo.title}
        </Text>
      </Flex>

      <Flex alignItems={"center"} gap={"5px"}>
        <Badge
          colorScheme={
            todoOpen?.todo_id === todo.todo_id
              ? todoOpen?.status
                ? "green"
                : "purple"
              : todo?.status
              ? "green"
              : "purple"
          }
        >
          {todoOpen?.todo_id === todo.todo_id
            ? todoOpen?.status
              ? "Выполнен"
              : "Выполняется"
            : todo?.status
            ? "Выполнен"
            : "Выполняется"}
        </Badge>
        {todo.owner?.id == user._id && (
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
            <MenuList>
              <MenuItem icon={<IoCopy />}>Дублировать</MenuItem>
              <>
                <MenuItem icon={<EditIcon />}>Переименовать</MenuItem>
                <MenuItem icon={<DeleteIcon />} onClick={delateTodo}>
                  Удалить
                </MenuItem>
              </>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
};
