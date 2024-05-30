import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../services/axios';
import { useAuth } from '../hooks/useAuth';

export const InvitePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [inviteUserInfo, setInviteUserInfo] = useState(null);

  const handleInvite = async () => {
    console.log(id, user.user_id)
    await axiosInstance
      .post("/users/invite_to_group", {
        invited_user_id: user.user_id,
        group_id: id,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const findUser = async () => {
      await axiosInstance
      .get(`/users/findUser?id=${id}`)
      .then((res) => setInviteUserInfo(res.data))
      .catch((err) => console.log(err));
    }
    if (inviteUserInfo === null) {
      findUser();      
    }

  }, [inviteUserInfo])

  return (
    <Center id="container" h={"100vh"} w={"100vw"}>
      <Center
        id="main"
        sx={{
          flexDirection: "column",
          borderWidth: "2px",
          padding: "30px",
          borderRadius: "20px",
          bgColor: "white",
          color: "black",
        }}
      >
        <Heading>Присоединиться к группе</Heading>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          my={"20px"}
          borderColor={"black"}
          padding={"30px"}
          gap={"5px"}
          borderWidth={"2px"}
          borderRadius={"20px"}
        >
          <Text>{inviteUserInfo?.username}</Text>
          <Text>{inviteUserInfo?.email}</Text>
        </Flex>
        <Button colorScheme="green" onClick={handleInvite}>Принять приглашение</Button>
      </Center>
    </Center>
  );
}
