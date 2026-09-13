import { apiClient } from "./api";

export const registerUser = async (data) => {
    return await apiClient.post("/user/register", data);
};

export const loginUser = async (data) => {
    return await apiClient.post("/user/login", data);
};