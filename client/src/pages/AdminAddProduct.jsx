import React, { useState } from "react";
import { createProduct } from "../api/api";

const AdminAddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setStock("");
        setImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description || !price || !category || !stock || !image) {
            setMessage("Please fill all fields and select an image");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("stock", stock);
            formData.append("image", image);

            await createProduct(formData);

            setMessage("✅ Product added successfully!");
            resetForm();
        } catch (err) {
            console.error(err);
            setMessage(err.message || err.message?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add New Product</h2>

            {message && (
                <div className={`mb-4 text-center px-4 py-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none h-24" />
                <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                <input type="file" onChange={e => setImage(e.target.files[0])} className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />

                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AdminAddProduct;
