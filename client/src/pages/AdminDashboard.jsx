import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
    const { admin, logoutAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            <header className="p-4 flex justify-between items-center bg-gray-100">
                <div>
                    <h1>Welcome, {admin?.name || "Admin"}</h1>
                    <div className="text-sm">{admin?.email}</div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/admin/add-product")}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        Edit / Delete Products
                    </button>
                    <button
                        onClick={logoutAdmin}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-4">
                <h2 className="text-xl font-bold">Dashboard</h2>
                {/* Add any dashboard widgets if needed */}
            </main>
        </div>
    );
};

export default AdminDashboard;
