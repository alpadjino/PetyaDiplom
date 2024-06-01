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
import { useIsMobileContext } from "../../context/IsMobileContext";

export const TodoCard = ({ todo, setLoading }) => {
  const { todoOpen, setTodoOpen } = useTodoContext();
  const { user } = useAuth();
  console.log("totdo", todo)
  const navigate = useNavigate();
  const toast = useToast();

  const { setIsMobile, defaultValue } = useIsMobileContext();

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
      bg={"transparent"}
      color={useColorModeValue("black", "white")}
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
        backgroundColor: "#aeaca63e",
      }}
      onClick={() => {
        console.log(todoOpen);
        if (
          todoOpen?.todo_id === todo?.todo_id &&
          window.location.pathname === "/"
        )
          return;

        if (todoOpen === null) {
          if (defaultValue === true) setIsMobile(defaultValue);
          navigate(`todos/${todo.todo_id}`);
        } else if (todoOpen.todo_id === todo.todo_id) {
          todoUpdate({ todoId: todo.todo_id, data: todoOpen });
          if (defaultValue === true) setIsMobile(!defaultValue);
          navigate("/");
        } else {
          todoUpdate({ todoId: todoOpen.todo_id, data: todoOpen });
          setTodoOpen(null);
          navigate(`/todos/${todo.todo_id}`);
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
        <Badge colorScheme={todo?.status ? "green" : "purple"}>
          {todo?.status ? "Выполнен" : "Выполняется"}
        </Badge>
        {todo.owner?.id == user?._id && (
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
