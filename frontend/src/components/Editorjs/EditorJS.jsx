import React, { useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Configuration from "./Configuration";
import { Box, Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import DragDrop from "editorjs-drag-drop";
import MermaidTool from "editorjs-mermaid";


import styles from './style.module.css'
import { useIsMobileContext } from "../../context/IsMobileContext";

const EditorComponent = ({ setValue, value, commitMessage, loading }) => {
  const [editor, seteditor] = useState({});

  const { isMobile } = useIsMobileContext();

  const [title, setTitle] = useState(value?.title);
  const handleReady = (editor) => {
    MermaidTool.config({ theme: "neutral" });
    new DragDrop(editor); // Инициализация DragDrop после завершения EditorJS
  };

  useEffect(() => {
    const editor = new EditorJS(Configuration(value.description), handleReady);
    seteditor(editor);
    setTitle(value.title);
    console.log("render")
    return () => {
      const elemnt = document.getElementsByClassName('codex-editor codex-editor--narrow')
      const codexEl = document.getElementsByClassName("codex-editor");

      if (!isMobile) Array.from(codexEl).forEach((elm) => elm.remove());
   
      Array.from(elemnt).forEach((elm) => elm.remove());
      console.log("Демонтаж")
    }
  }, [commitMessage]);

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
      }}
    >
      <Flex width={"100%"} flexDirection={"column"} alignItems={"center"}>
        <Button onClick={() => onSave()}>Сохранить изменения</Button>

        <Text>Заголовок</Text>
        <Box maxWidth={"300px"}>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            bgColor="transparent"
            color={useColorModeValue("black", "white")}
            outline={"none"}
            placeholder={"Заголовок"}
          />
        </Box>
      </Flex>
      <div id="editorjs" className={styles.main} />
    </div>
  );
};

export default EditorComponent;
