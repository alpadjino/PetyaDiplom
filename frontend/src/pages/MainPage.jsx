import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom";

export const MainPage = () => {
  useEffect(() => {
    document.title="Главная"
  }, [])
  return (
    <Flex id="mainContainer">
      <Outlet />
    </Flex>
  );
}
