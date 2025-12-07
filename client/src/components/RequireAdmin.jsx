import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, getToken } from "../utils/auth";

const RequireAdmin = ({ children }) => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireAdmin;
