import { Button, useToast } from '@chakra-ui/react';
import React from 'react'
import { useAuth } from '../../hooks/useAuth';

export const AddToGroupModal = () => {
  const toast = useToast();
  const { user } = useAuth();
  
  return (
    <Button
      color={"black"}
      colorScheme="gray"
      outlineColor={"black"}
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
        })
      }}
    >
      Добавить в группу
    </Button>
  );
}
