import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, admin } = useContext(AuthContext);

    if (adminOnly && !admin) return <Navigate to="/login-choice" />;
    if (!adminOnly && !user) return <Navigate to="/login-choice" />;

    return children;
};

export default PrivateRoute;
