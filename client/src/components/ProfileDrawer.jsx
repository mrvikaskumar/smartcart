import React from "react";
import { FiX } from "react-icons/fi";

const ProfileDrawer = ({ open, onClose, user, admin, handleLogout }) => {
    if (!open) return null;

    const name = user?.name || admin?.name || "User";
    const email = user?.email || admin?.email || "email@example.com";
    const role = user ? "User" : admin ? "Admin" : "Unknown";

    return (
        <>
            {/* Transparent overlay that doesn't block visibility */}
            <div
                className="fixed inset-0 bg-transparent z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg flex flex-col pointer-events-auto transition-transform duration-300 ease-in-out translate-x-0">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-bold text-lg">Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-4">
                    <p className="font-semibold text-gray-800">{name}</p>
                    <p className="text-gray-600 mt-1">{email}</p>
                    <p className="text-gray-500 mt-1">Role: {role}</p>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileDrawer;
