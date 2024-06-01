import React, { useState, useRef, useEffect, Fragment, useCallback } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import mermaid from "mermaid";
import { Box, Button, Center, Container, Flex, Input, Spinner, Switch, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";
import { useTodoContext } from "../../context/TodoIsOpenContext";
import { todoUpdate } from "../../utils/apiFunctions";
import { useIsMobileContext } from "../../context/IsMobileContext";

{/* Пример вывода текста mermaid, который создает графики, если вставить его в editor можно посмотреть как это выглядит */}

const mdMermaid = `The following are some examples of the diagrams, charts and graphs that can be made using Mermaid and the Markdown-inspired text specific to it. 

\`\`\`mermaid
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
\`\`\`

\`\`\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
\`\`\`


`;

{
  /*Код, который позволяет подключить графики mermaid, взял с оф. документации на сайте npm @uiw/react-md-editor */
}
const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
const Code = ({ inline, children = [], className, ...props }) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState(null);
  const isMermaid =
    className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code = children
    ? getCodeString(props.node.children)
    : children[0] || "";

  useEffect(() => {
    if (container && isMermaid && demoid.current && code) {
      mermaid
        .render(demoid.current, code)
        .then(({ svg, bindFunctions }) => {
          container.innerHTML = svg;
          if (bindFunctions) {
            bindFunctions(container);
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [container, isMermaid, code, demoid]);

  const refElement = useCallback((node) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: "none" }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </Fragment>
    );
  }
  return <code className={className}>{children}</code>;
};

export default function MardownEditor({ value, setValue, commitMessage, loading }) {
  const navigate = useNavigate();

  const { setIsMobile, defaultValue } = useIsMobileContext();
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
      <Box
        overflow={"hidden"}
        overflowY={"scroll"}
        padding={"20px"}
        maxH={"100vh"}
      >
        <Flex
          flexDirection={"column"}
          borderWidth={"20px"}
          bgColor={"white"}
          borderRadius={"20px"}
          borderColor={"white"}
          gap={"10px"}
        >
          {/* Center отвечает за заголовок и поле Input с заголовком */}
          <Center flexDir={"column"} color={"black"}>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Text>Заголовок</Text>

              <Button
                colorScheme="gray"
                color={"black"}
                onClick={() => {
                  todoUpdate({ todoId: value.todo_id, data: value });
                  setValue(null);
                  if (defaultValue === true) setIsMobile(!defaultValue);
                  navigate("/", { replace: true });
                  document.title = "Главная";
                  // Отправить запрос на бек с сохранением данных
                }}
              >
                <CloseIcon />
              </Button>
            </Flex>

            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
              gap={"15px"}
              flexDir={"row-reverse"}
            >
              <Box>
                <Switch
                  title="Статус выполнения"
                  onChange={(e) => {
                    const updatedTodo = {
                      ...value,
                      status: e.target.checked,
                    };
                    setValue(updatedTodo);
                  }}
                  isChecked={value?.status}
                  id="id-done"
                  size="lg"
                  name="status"
                  isDisabled={false}
                  colorScheme="green"
                  bgColor={"red"}
                  padding={0}
                  borderRadius={"15px"}
                />
              </Box>

              <Input
                value={value?.title}
                onChange={(event) => {
                  const updatedTodo = {
                    ...value,
                    title: event.target.value,
                  };
                  setValue(updatedTodo);
                }}
                bgColor="gray.100"
                color={"black"}
                placeholder={"Заголовок"}
              />
            </Flex>
          </Center>

          {/* Кастомный эдитор текста, позволяет создавать текст с помощью Markdown, 
            а так же подключил mermaid для создания графиков. Это делается за счет расширения ключевых слов в маркдаунах.
            Синтаксис можно на оф сайте посмотреть, концептуально он не сложный от слова совсем, но позволяет делать 
            неплохие графики для большинства  
            */}

          <MDEditor
            onChange={(newContent) => {
              const updatedTodo = {
                ...value,
                description: newContent,
              };
              setValue(updatedTodo);
            }}
            textareaProps={{
              placeholder: "Please enter Markdown text",
            }}
            height={"100%"}
            overflow={true}
            value={value?.description}
            previewOptions={{
              components: {
                code: Code,
              },
            }}
          />

          <Center>
            <Button colorScheme="green" onClick={() => commitMessage(value)}>
              Сохранить изменения
            </Button>
          </Center>
        </Flex>
      </Box>
    );
}
