import React, { useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Configuration from "./Configuration";
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import DragDrop from "editorjs-drag-drop";
import MermaidTool from "editorjs-mermaid";


import styles from './style.module.css'
import { useIsMobileContext } from "../../context/IsMobileContext";
import { useTodoContext } from "../../context/TodoIsOpenContext";
import { useNavigate } from "react-router-dom";

import { CloseIcon } from "@chakra-ui/icons";
import { RiSave3Fill } from "react-icons/ri";
import { todoUpdate } from "../../utils/apiFunctions";

const EditorComponent = ({ setValue, value, commitMessage, loading }) => {
  const [editor, setEditor] = useState({});

  const navigate = useNavigate();

  const { setTodoOpen } = useTodoContext();

  const { isMobile, setIsMobile, defaultValue } = useIsMobileContext();

  const [title, setTitle] = useState(value?.title);
  const handleReady = (editor) => {
    MermaidTool.config({ theme: "neutral" });
    new DragDrop(editor); // Инициализация DragDrop после завершения EditorJS
  };
console.log(title)
  useEffect(() => {
    const editor = new EditorJS(Configuration(value?.description), handleReady);
    setEditor(editor);
    console.log("render");

    return () => {
      console.log("Демонтаж");
      const elemnt = document.getElementsByClassName(
        "codex-editor codex-editor--narrow"
      );
      const codexEl = document.getElementsByClassName("codex-editor");

      if (!isMobile) Array.from(codexEl).forEach((elm) => elm.remove());

      Array.from(elemnt).forEach((elm) => elm.remove());
    };
  }, [commitMessage]);

  const handleCloseTodo = () => {
    editor.save().then((newContent) => {
      todoUpdate({
        todoId: value.todo_id,
        data: {
          ...value,
          title: title,
          description: newContent,
        },
      });
    });    
    navigate("/");
    setTodoOpen(null);
    if (defaultValue) setIsMobile(!isMobile);
    document.title = "Главная";

  };
  const onSave = () => {
    editor
      .save()
      .then((newContent) => {
        const updatedTodo = {
          ...value,
          title: title,
          description: newContent,
        };
        setValue(updatedTodo);

        console.log("NEwContent", updatedTodo);
        return updatedTodo
      })
      .then((updTodo) => {
        commitMessage(updTodo);
      })
      .then(() => console.log(value))
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  return (
    <div
      style={{
        width: "100%",
        overflowY: "scroll",
        paddingLeft: "25px",
        paddingRight: "25px",
      }}
    >
      <Flex
        width={"100%"}
        justifyContent={"center"}
        flexDirection={"row-reverse"}
        gap={"16vw"}
        alignItems={"flex-end"}
      >
        <Flex alignItems={"center"} justifyContent={"center"} gap={"10px"}>
          <Button
            colorScheme="none"
            fontSize={"20px"}
            title="Сохранить изменения"
            color={useColorModeValue("black", "white")}
            onClick={() => onSave()}
          >
            <RiSave3Fill />
          </Button>
          <Button
            title="Закрыть вкладку"
            colorScheme="none"
            color={useColorModeValue("black", "white")}
            onClick={handleCloseTodo}
          >
            <CloseIcon />
          </Button>
        </Flex>

        <Flex flexDirection={"column"} alignItems={"center"} maxWidth={"300px"}>
          <Text>Заголовок</Text>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            bgColor="transparent"
            color={useColorModeValue("black", "white")}
            outline={"none"}
            placeholder={"Заголовок"}
          />
        </Flex>
      </Flex>

      <div id="editorjs" className={styles.main} />
    </div>
  );
};

export default EditorComponent;
