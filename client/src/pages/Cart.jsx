import React, { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart, clearCart } from "../api/api";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    // ✅ Get logged-in user dynamically
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const fetchCart = async () => {
        if (!userId) return; // If user not logged in, do nothing
        try {
            const data = await getCart(userId);
            setCart(data);
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userId]); // refetch if user changes

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity < 1) return;
        await updateCart(userId, productId, quantity);
        fetchCart();
    };

    const handleRemove = async (productId) => {
        await removeFromCart(userId, productId);
        fetchCart();
    };

    const handleClearCart = async () => {
        await clearCart(userId);
        fetchCart();
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    if (!userId) return <p className="text-center mt-6">Please login to view your cart.</p>;
    if (!cart) return <p className="text-center mt-6">Loading cart...</p>;
    if (cart.products.length === 0)
        return <p className="text-center mt-6 text-gray-700">Your cart is empty.</p>;

    const totalAmount = cart.products.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Your Cart</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Cart Items */}
                <div className="flex-1 flex flex-col gap-4">
                    {cart.products.map((item) => (
                        <div
                            key={item.productId._id}
                            className="flex flex-col sm:flex-row items-center justify-between border p-4 rounded-lg shadow hover:shadow-md transition-shadow bg-white"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <img
                                    src={item.productId.imageUrl || "https://via.placeholder.com/100"}
                                    alt={item.productId.name}
                                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                                />
                                <div>
                                    <h2 className="font-semibold text-gray-800">{item.productId.name}</h2>
                                    <p className="text-gray-600 mt-1">₹{item.productId.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 sm:mt-0">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(item.productId._id, Number(e.target.value))
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => handleRemove(item.productId._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="w-full lg:w-1/3 border p-6 rounded-lg shadow bg-white flex flex-col gap-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Order Summary</h2>
                    <p className="text-gray-700 text-lg">
                        Total: <span className="font-bold text-gray-900">₹{totalAmount}</span>
                    </p>
                    <button
                        onClick={handleClearCart}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
