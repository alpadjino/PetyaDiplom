import React, { useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Configuration from "./Configuration";
import { Button, Input, Text } from "@chakra-ui/react";

const EditorComponent = ({ setValue, value, commitMessage, loading }) => {
  const [editor, seteditor] = useState({});

  useEffect(() => {
    const editor = new EditorJS(Configuration());
    seteditor(editor);
  }, []);

  const onSave = () => {
    editor
      .save()
      .then((outputData) => {
        console.log("Article data: ", outputData);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  return (
    <div>
      <Button onClick={onSave}>Save</Button>
      <Text>Заголовок</Text>
      <Input />
      <div id="editorjs" />
    </div>
  );
};

export default EditorComponent;
