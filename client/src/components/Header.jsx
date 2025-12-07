import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiShoppingCart } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import ProfileDrawer from "./ProfileDrawer";

const Header = ({ toggleSidebar }) => {
    const { user, admin, logoutUser, logoutAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        if (user) logoutUser();
        if (admin) logoutAdmin();
        setDrawerOpen(false);
        navigate("/");
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
            {/* Sidebar toggle - only for normal users */}
            {user && (
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded hover:bg-blue-500 transition"
                >
                    <FiMenu size={24} />
                </button>
            )}

            {/* Logo */}
            <Link
                to="/"
                className="text-2xl md:text-3xl font-bold hover:text-gray-200"
            >
                SmartCart
            </Link>

            {/* Search - show for both users and admin */}
            <div className="flex-1 mx-4 w-full md:max-w-md">
                <input
                    type="text"
                    placeholder="Search products, categories..."
                    className="w-full px-4 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
                {!user && !admin ? (
                    <>
                        <button
                            onClick={() => navigate("/login-choice")}
                            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition"
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        {/* Only show cart for normal users */}
                        {user && (
                            <button
                                onClick={() => navigate("/cart")}
                                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition"
                            >
                                <FiShoppingCart />
                                Cart
                            </button>
                        )}

                        {/* Profile button */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition"
                        >
                            <FiUser />
                            {user?.name || admin?.name}
                        </button>

                        {/* Profile drawer */}
                        <ProfileDrawer
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            user={user}
                            admin={admin}
                            handleLogout={handleLogout}
                        />
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
