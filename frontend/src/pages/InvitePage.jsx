import { Button, Center, Flex, Heading, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../services/axios';
import { useAuth } from '../hooks/useAuth';

export const InvitePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [inviteUserInfo, setInviteUserInfo] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const handleInvite = async () => {
    console.log(id, user.user_id)
    await axiosInstance
      .post("/users/invite_to_group", {
        invited_user_id: user.user_id,
        group_id: id,
      })
      .then((res) => {
        toast({
          colorScheme: "green",
          description: "Вы присоединились к группе!",
          title: "Успех!",
          status: "success",
        })
        navigate('/');
      })
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
        bgColor={useColorModeValue("white", "#072b3d")}
        sx={{
          flexDirection: "column",
          borderWidth: "2px",
          padding: "30px",
          borderRadius: "20px",
          // boxShadow: "0px 0px 20px 4px #27a7e7",
        }}
      >
        <Heading
          color={useColorModeValue("black", "white")}
          textAlign={"center"}
        >
          Присоединиться к группе
        </Heading>
        <Flex
          color={useColorModeValue("black", "white")}
          flexDirection={"column"}
          my={"20px"}
          padding={"30px"}
          gap={"5px"}
        >
          <Flex alignItems={"center"} gap={"5px"}>
            <Text fontSize={"18px"} fontWeight={"400"}>
              Название группы:
            </Text>
            <Text>{inviteUserInfo?.username}</Text>
          </Flex>
          <Flex alignItems={"center"} gap={"5px"}>
            <Text fontSize={"18px"} fontWeight={"400"}>
              Почта владельца:
            </Text>
            <Text>{inviteUserInfo?.email}</Text>
          </Flex>
        </Flex>
        <Button
          colorScheme={useColorModeValue("green", "blue")}
          onClick={handleInvite}
        >
          Принять приглашение
        </Button>
      </Center>
    </Center>
  );
}
