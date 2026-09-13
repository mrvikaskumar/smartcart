import { apiClient } from "./api";

export const loginAdmin = async (data) => {
    return await apiClient.post("/admin/login", data);
};