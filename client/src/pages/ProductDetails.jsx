import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { addToCart, getProductById } from "../api/api"; 
import { AuthContext } from "../context/AuthContext"; 

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const userId = user?.id || user?._id;

        if (!userId) {
            alert("Please login first!");
            return;
        }

        try {
            await addToCart(userId, product._id, 1);
            alert("Added to cart ✅");
        } catch (err) {
            console.error("Add to cart error:", err);
            alert("Failed to add to cart!");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!product) return <p className="text-center mt-10">Product not found.</p>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
                    <img
                        src={product.imageUrl || "https://via.placeholder.com/400"}
                        alt={product.name}
                        className="object-contain h-96 w-full"
                    />
                </div>

                <div className="md:w-1/2 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-gray-500">Category: {product.category}</p>
                    <p className="text-blue-600 font-bold text-2xl">₹{product.price}</p>
                    <p className="text-gray-800 mt-4">{product.description}</p>

                    <button
                        onClick={handleAddToCart}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;