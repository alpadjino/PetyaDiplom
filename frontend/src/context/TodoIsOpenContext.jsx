import React, { createContext, useContext, useState } from 'react'

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todoOpen, setTodoOpen] = useState(null);

    return (
        <TodoContext.Provider value={{ todoOpen, setTodoOpen }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodoContext = () => useContext(TodoContext);