import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from 'react'

import styles from "./UserInfo.module.css";

import { useAuth } from '../../../hooks/useAuth';
import { UserEditModal } from '../../UserEditModal/UserEditModal';

export const UserInfo = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log(user);
  }, [onClose]);

  return (
    <Flex className={styles.userInfo} bg={"transparent"}>
      <UserEditModal
        isOpen={isOpen}
        onClose={onClose}
      />
      <Text>{user?.username}</Text>

      <Button
        onClick={onOpen}
        title="Редактировать профиль"
        colorScheme="none"
        color={useColorModeValue("black", "white")}
      >
        <EditIcon />
      </Button>
    </Flex>
  );
}
