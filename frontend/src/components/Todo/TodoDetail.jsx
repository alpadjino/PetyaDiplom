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
import { useAuth } from "../../hooks/useAuth";
import { todoSave, todoUpdate } from "../../utils/apiFunctions";
import { useIsMobileContext } from "../../context/IsMobileContext";

export const TodoDetail = () => {
  const [todo, setTodo] = useState({});
  const [loading, setLoading] = useState(true);
  const { todoId } = useParams();

  const { user } = useAuth();

  const { todoOpen, setTodoOpen } = useTodoContext();
  const { isMobile, setIsMobile, defaultValue} = useIsMobileContext();

  const [websckt, setWebsckt] = useState();

  const commitMessage = (message) => {
    todoUpdate({ todoId: message.todo_id, data: message })

    websckt.send((JSON.stringify(message)));
  };

  useEffect(() => {
    console.log("создался", loading, todoId, todoOpen === null);

    if (defaultValue === true) setIsMobile(defaultValue);
    console.log("todoOpen", todoOpen);
    if (todoOpen === null) fetchTodo();

    const url = `ws://localhost:8000/ws/todo/${todoId}`;
    const ws = new WebSocket(url);

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log("DETAIL", message);
      setTodoOpen(message);
    };

    setWebsckt(ws);

    return () => {
      ws.close();
      console.log("Сломався");
      setTodoOpen(null);
      setLoading(true);
    };
  }, [todoId]);

  const fetchTodo = () => {
    setLoading(true);
    axiosInstance
      .get(`/todo/${todoId}`)
      .then((res) => {
        setTodoOpen(res.data);
        console.log("res", res.data)
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
      <MarkdownEditor
        setValue={setTodoOpen}
        value={todoOpen}
        commitMessage={commitMessage}
        loading={loading}
      />
    </Flex>
  );
};
