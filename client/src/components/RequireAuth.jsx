import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const RequireAuth = ({ children }) => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RequireAuth;
