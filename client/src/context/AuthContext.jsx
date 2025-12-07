import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    });

    const [admin, setAdmin] = useState(() => {
        const adminData = localStorage.getItem("admin");
        return adminData ? JSON.parse(adminData) : null;
    });

    const loginUser = (data) => {
        // data should include { _id, name, email, token, role }
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
    };

    const loginAdmin = (data) => {
        localStorage.setItem("admin", JSON.stringify(data));
        setAdmin(data);
    };

    const logoutUser = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const logoutAdmin = () => {
        localStorage.removeItem("admin");
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ user, admin, loginUser, loginAdmin, logoutUser, logoutAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
