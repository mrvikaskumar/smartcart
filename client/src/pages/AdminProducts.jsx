import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../api/api"; // ✅ API helpers
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setMessage("❌ Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const data = await deleteProduct(id);
            if (data?.message) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
                setMessage("✅ Product deleted successfully!");
            } else {
                setMessage("❌ Error deleting product");
            }
        } catch (err) {
            console.error("Delete error:", err);
            setMessage("❌ Error deleting product");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
                <Link
                    to="/admin/add-product"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                    <FiPlus /> Add New Product
                </Link>
            </div>

            {message && (
                <div className={`mb-4 text-center px-4 py-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="border p-3">Name</th>
                            <th className="border p-3">Category</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Stock</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="border p-3">{product.name}</td>
                                <td className="border p-3">{product.category}</td>
                                <td className="border p-3">₹{product.price}</td>
                                <td className={`border p-3 font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                                    {product.stock}
                                </td>
                                <td className="border p-3 flex gap-2">
                                    <Link
                                        to={`/admin/edit-product/${product._id}`}
                                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                                    >
                                        <FiEdit /> Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
