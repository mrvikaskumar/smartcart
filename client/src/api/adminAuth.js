import axios from "axios";

const ADMIN_API = "http://localhost:5000/api/admin";

export const loginAdmin = async (data) => {
    return await axios.post(`${ADMIN_API}/login`, data);
};