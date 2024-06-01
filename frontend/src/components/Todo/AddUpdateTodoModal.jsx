import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";

import { useTodoContext } from "../../context/TodoIsOpenContext";
import { AddIcon } from "@chakra-ui/icons";

export const AddUpdateTodoModal = ({
  defaultValues = {},
  onSuccess = () => {},
  ...rest
}) => {
  const { todoOpen, setTodoOpen } = useTodoContext();

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { todoId } = useParams();
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...defaultValues },
  });

  const onSubmit = async (values) => {
    try {
      console.log(values)

        await axiosInstance.post(`/todo/create/`, values)
        .then((res) =>{ 
          console.log(res.data)
          navigate(`/todos/${res.data.todo_id}`);
        });
      
      toast({
        title: "Добавлена заметка",
        status: "success",
        isClosable: true,
        diration: 1500,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка при создании заметки",
        status: "error",
        isClosable: true,
        diration: 1500,
      });
    }
  };

  return (
    <Box {...rest}>
      <Flex gap={"10px"} mx={"10px"}>
        <Button
          w="100%"
          colorScheme={"none"}
          color={useColorModeValue("black", "white")}
          onClick={onOpen}
          _hover={{
            backgroundColor: "#aeaca63e",
          }}
        >
          <AddIcon />
        </Button>
      </Flex>
      <Modal
        closeOnOverlayClick={false}
        size="4xl"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />

        <FormProvider register={register}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Создать</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={errors.title}>
                  <Input
                    placeholder="Заголовок"
                    background={useColorModeValue("gray.300", "gray.600")}
                    type="text"
                    variant="filled"
                    size="lg"
                    mt={6}
                    {...register("title", {
                      required: "Это обязательное поле",
                      minLength: {
                        value: 5,
                        message: "Title must be at least 5 characters",
                      },
                      maxLength: {
                        value: 55,
                        message: "Title must be at most 55 characters",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.title && errors.title.message}
                  </FormErrorMessage>
                </FormControl>
                {/* <FormControl isInvalid={errors.description}>
                  <Textarea
                    rows={5}
                    placeholder="Добавить описание..."
                    background={useColorModeValue("gray.300", "gray.600")}
                    type="test"
                    variant="filled"
                    size="lg"
                    mt={6}
                    {...register("description", {
                      required: "Это обязательное поле",
                      minLength: {
                        value: 5,
                        message: "Description must be at least 5 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Description must be at most 200 characters",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
                </FormControl> */}
                {/* <FormControl>
                  <MardownEditor
                    name="description"
                    setValue={setValue}
                    {...register("description", {
                      required: "Это обязательное поле",
                      minLength: {
                        value: 5,
                        message: "Description must be at least 5 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Description must be at most 200 characters",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
                </FormControl> */}
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormControl mt={6} display="flex" alignItems="center">
                      <FormLabel htmlFor="is-done">Статус</FormLabel>
                      <Switch
                        onChange={(e) => field.onChange(e.target.checked)}
                        isChecked={field.value}
                        id="id-done"
                        size="lg"
                        name="status"
                        isDisabled={false}
                        colorScheme="green"
                        variant="ghost"
                      />
                    </FormControl>
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Stack direction="row" spacing={4}>
                  <Button onClick={onClose} disabled={isSubmitting}>
                    Закрыть
                  </Button>
                  <Button
                    colorScheme="green"
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Создание"
                  >
                    Создать
                  </Button>
                </Stack>
              </ModalFooter>
            </ModalContent>
          </form>
        </FormProvider>
      </Modal>
    </Box>
  );
};
