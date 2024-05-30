import { Box, Text } from '@chakra-ui/react';
import React from 'react'
import { TodoCard } from './TodoCard';

export const OtherTodo = ({ otherTodo: otherTodos, setLoading: setLoading }) => {
    console.log(otherTodos)
      if (!otherTodos || otherTodos.length === 0) {
        return <Text>No other todos found.</Text>;
      }
    return otherTodos.map((todo) => (
    <Box key={todo.name}>
      <Text key={todo.name}>{todo.name}</Text>
      {todo.todos.map((todoData) => (
        <TodoCard todo={todoData} setLoading={setLoading} key={todo.todo_id} />
      ))}
    </Box>
  ));
};
