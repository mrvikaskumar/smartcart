import React, { useEffect, useState, useContext, useMemo } from "react";
import { getAllProducts } from "../api/api";
import HeroCarousel from "../components/HeroCarousel";
import CategorySidebar from "../components/CategorySidebar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = ({ sidebarOpen, setSidebarOpen }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { admin } = useContext(AuthContext);

    // ✅ Fetch products on mount
    useEffect(() => {
        let mounted = true;

        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                if (mounted) {
                    setProducts(data || []);
                }
            } catch (err) {
                console.error(err);
                if (mounted) setError("Failed to load products.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            mounted = false;
        };
    }, []);

    // ✅ Redirect if admin logs in
    useEffect(() => {
        if (admin) navigate("/admin/dashboard");
    }, [admin, navigate]);

    // ✅ Optimized filtering with useMemo (prevents recalculations)
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return products;
        return products.filter(
            (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }, [products, selectedCategory]);

    return (
        <div className="flex relative min-h-[calc(100vh-64px)]">
            {/* ✅ Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen bg-white z-50 shadow-lg transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                w-64 md:w-64 sm:w-full`}
            >
                <CategorySidebar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    fullWidth={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                />
            </div>

            {/* ✅ Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden cursor-pointer transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ✅ Main content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 
                ${sidebarOpen ? "md:ml-64" : "md:ml-0"}`}
            >
                {/* Show HeroCarousel only on 'All' */}
                {selectedCategory === "All" && <HeroCarousel />}

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* ✅ Loading state */}
                    {loading && (
                        <p className="text-gray-600 col-span-full text-center">Loading...</p>
                    )}

                    {/* ✅ Error state */}
                    {error && !loading && (
                        <p className="text-red-500 col-span-full text-center">{error}</p>
                    )}

                    {/* ✅ Empty state */}
                    {!loading && !error && filteredProducts.length === 0 && (
                        <p className="text-gray-600 col-span-full text-center">
                            No products available
                        </p>
                    )}

                    {/* ✅ Product list */}
                    {!loading &&
                        !error &&
                        filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white border rounded-lg shadow hover:shadow-lg 
                                transition-transform hover:-translate-y-1 flex flex-col overflow-hidden"
                            >
                                <div className="h-48 bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={product.imageUrl || "https://via.placeholder.com/400"}
                                        alt={product.name}
                                        className="object-contain h-full w-full p-2"
                                    />
                                </div>

                                <div className="p-4 flex flex-col flex-1 justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                                        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                                    </div>

                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-blue-600 font-bold text-lg">
                                            ₹{product.price}
                                        </span>
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="bg-blue-600 text-white px-2 py-1 rounded text-sm 
                                            hover:bg-blue-700 transition"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
