import { Button, useColorModeValue, useToast } from '@chakra-ui/react';
import React from 'react'
import { useAuth } from '../../hooks/useAuth';
import { IoIosPersonAdd } from "react-icons/io";


export const AddToGroupModal = () => {
  const toast = useToast();
  const { user } = useAuth();
  
  return (
    <Button
    title='Добавить в группу'
      colorScheme="none"
      color={useColorModeValue("black", "white")}
      _hover={{
        backgroundColor: "#aeaca63e",
      }}
      mx={"10px"}
      onClick={() => {
        console.log(`http://localhost:3000/inviteLink/${user.user_id}`);
        navigator.clipboard.writeText(
          `http://localhost:3000/inviteLink/${user.user_id}`
        );
        toast({
          title: "Добавление в группу",
          description: "Ссылка на добавление скопирована!",
          isClosable: true,
          duration: 3000,
          status: "success",
        });
      }}
    >
      <IoIosPersonAdd fontSize={"25px"} />
    </Button>
  );
}
