// Файл отвечает за функции, которые отвечают за взаимодействие с тудушками между клиент-сервером

import axiosInstance from "../services/axios";

// Функция, позволяющая записывать тудушки в БД.
export const todoSave = async (data) => {
    await axiosInstance.post(`/todo/create/`, data);
}

export const todoUpdate = async ({ todoId, data }) => {
  await axiosInstance.put(`/todo/${todoId}`, data);
};