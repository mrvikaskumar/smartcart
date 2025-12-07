import React from "react";
import { useNavigate } from "react-router-dom";

const LoginChoice = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h2 className="text-2xl mb-6">Login as:</h2>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    User
                </button>
                <button
                    onClick={() => navigate("/admin/login")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Admin
                </button>
            </div>
        </div>
    );
};

export default LoginChoice;
