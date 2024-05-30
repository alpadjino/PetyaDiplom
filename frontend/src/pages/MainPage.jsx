import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from "react-router-dom";
import { TodoList } from '../components/Todo/TodoList';

export const MainPage = () => {
  return (
    <Flex id="mainContainer">
      <Outlet />
    </Flex>
  );
}
