import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../api/api";

const AdminEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", stock: "" });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            if (data) {
                setProduct(data);
                setFormData({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category,
                    stock: data.stock
                });
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImage = (e) => setImage(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const updateData = new FormData();
            updateData.append("name", formData.name);
            updateData.append("description", formData.description);
            updateData.append("price", formData.price);
            updateData.append("category", formData.category);
            updateData.append("stock", formData.stock);
            if (image) updateData.append("image", image);

            await updateProduct(id, updateData);

            setMessage("✅ Product updated successfully!");
            setTimeout(() => navigate("/admin/products"), 1500);
        } catch (err) {
            console.error(err);
            setMessage(err.message || err.message?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Product</h2>
            {message && <div className={`mb-4 text-center px-4 py-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none h-24" />

                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />

                <div>
                    <p className="mb-2 text-gray-700 font-medium">Current Image:</p>
                    <img src={product.imageUrl} alt="" className="w-32 mb-2 rounded border" />
                    <input type="file" onChange={handleImage} className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500" />
                </div>

                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default AdminEditProduct;
