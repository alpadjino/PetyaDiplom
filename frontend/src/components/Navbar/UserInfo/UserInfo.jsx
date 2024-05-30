import { EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useState } from 'react'

import styles from "./UserInfo.module.css";

import { useAuth } from '../../../hooks/useAuth';

export const UserInfo = () => {
  const { user, updateUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  
  const [userData, setUserData] = useState({ ...user });
  console.log(userData);
  // console.log(userData)
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setUserData((prev) => ({...prev, [name]: value}));
  }
  return (
    <Flex
      className={styles.userInfo}
      bg={useColorModeValue("gray.300", "gray.600")}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактирование профиля</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={"10px"}>
            <Box>
              <Text>Юзернейм</Text>
              <Input
                name="username"
                type="text"
                onChange={handleInputChange}
                value={userData?.username}
                placeholder="Юзернейм"
              />
            </Box>
            <Box>
              <Text>Почта</Text>
              <Input
                name="email"
                type="email"
                onChange={handleInputChange}
                value={userData?.email}
                placeholder="Почта"
              />
            </Box>
            <Box>
              <Text>Имя</Text>
              <Input
                name="first_name"
                type="text"
                onChange={handleInputChange}
                value={userData?.first_name}
                placeholder="Имя"
              />
            </Box>
            <Box>
              <Text>Фамилия</Text>
              <Input
                name="last_name"
                type="text"
                onChange={handleInputChange}
                value={userData?.last_name}
                placeholder="Фамилия"
              />
            </Box>
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"space-between"}>
            <Button variant="ghost" onClick={onClose}>
              Отменить
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={
                () => {
                  // Обновляем юзера
                  updateUser(userData.user_id, userData);
                  // Вызываем свит алёрт
                  toast({
                    type: "success",
                    description: "Данные обновлены",
                    title: "Обновление данных",
                    duration: "3000",
                    position: "top",
                  });

                  // Закрываем модалку
                  onClose();
                }
                //updateUser(user.user_id, )
              }
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text>{user?.username}</Text>

      <Button
        onClick={onOpen}
        title="Редактировать профиль"
        colorScheme="none"
        color={"black"}
      >
        <EditIcon />
      </Button>
    </Flex>
  );
}
