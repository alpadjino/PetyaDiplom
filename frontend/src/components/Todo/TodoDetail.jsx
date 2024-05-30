import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { React, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { AddUpdateTodoModal } from "./AddUpdateTodoModal";
import MarkdownEditor from "../MardownEditor/MardownEditor";
import { Tiptap } from "../TipTap/TipTap";
import Details from "../TipTap/Details";

import EditorJS from "@editorjs/editorjs";
import { useTodoContext } from "../../context/TodoIsOpenContext";

export const TodoDetail = () => {
  const [todo, setTodo] = useState({});
  const [loading, setLoading] = useState(true);
  const { todoId } = useParams();

  const { todoOpen, setTodoOpen } = useTodoContext();

  useEffect(() => {
    fetchTodo();
  }, [todoId]);

  const fetchTodo = () => {
    setLoading(true);
    axiosInstance
      .get(`/todo/${todoId}`)
      .then((res) => {
        setTodoOpen(res.data);
        console.log(res.data)
        document.title = res.data.title;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Container mt={6}>
        <Center mt={6}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="green.200"
            color="green.500"
            size="xl"
          />
        </Center>
      </Container>
    );
  }

  return (
    <Flex width={"100%"} flexDir={"column"} mx={"15px"}>
      {/* <Flex
        bg={background}
        minHeight="7rem"
        flexDir={"column"}
        my={3}
        p={3}
        rounded="lg"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={22}>{todo.title}</Text>
        <Text bg="gray.500" mt={2} p={2} rounded="lg">
          {todo.description}
        </Text>
        <AddUpdateTodoModal
          my={3}
          editable={true}
          defaultValues={{
            title: todo.title,
            description: todo.description,
            status: todo.status,
          }}
          onSuccess={fetchTodo}
        />
        <Button
          isLoading={loading}
          colorScheme="red"
          width="100%"
          onClick={delateTodo}
        >
          Удалить
        </Button>
      </Flex> */}
      {/* <div>
        <Tiptap setDescription={setDescription} />
        <Details description={description} />
      </div> */}

      <MarkdownEditor setValue={setTodoOpen} value={todoOpen} />
      {/* 
      <EditorJS /> */}
    </Flex>
  );
};
