import React, { useEffect, useState, useContext } from "react";
import { getCart, createCheckout, paymentSuccess, clearCart } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
    const { user } = useContext(AuthContext); // get logged-in user
    const userId = user?._id || user?.id;
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    // Fetch cart for logged-in user
    useEffect(() => {
        if (!userId) return; // safety
        const fetchCart = async () => {
            try {
                const data = await getCart(userId);
                setCart(data);
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        };
        fetchCart();
    }, [userId]);

    if (!userId) return <p className="text-center mt-6">Please login to checkout.</p>;
    if (!cart) return <p className="text-center mt-6">Loading cart...</p>;
    if (cart.products.length === 0)
        return <p className="text-center mt-6 text-gray-700">Your cart is empty.</p>;

    const totalAmount = cart.products.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
    );

    const loadRazorpay = (src) =>
        new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handlePayment = async () => {
        const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) return alert("Razorpay SDK failed to load. Check your internet.");

        try {
            const order = await createCheckout(userId); // backend creates Razorpay order
            if (!order) return alert("Failed to create order.");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY, // frontend key
                amount: order.amount,
                currency: order.currency,
                name: "SmartCart",
                description: "Purchase from SmartCart",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const result = await paymentSuccess(
                            userId,
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );

                        if (result) {
                            alert("✅ Payment successful!");
                            await clearCart(userId); // clear cart after successful payment
                            navigate("/orders"); // redirect to orders page
                        } else {
                            alert("❌ Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Payment verification error:", err);
                        alert("❌ Payment verification failed.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#2563EB" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment Error:", err);
            alert("❌ Payment failed. Try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Checkout</h1>

            <div className="bg-white border rounded-lg shadow p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                {cart.products.map((item) => (
                    <div
                        key={item.productId._id}
                        className="flex justify-between items-center mb-3 border-b pb-2"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={item.productId.imageUrl || "https://via.placeholder.com/60"}
                                alt={item.productId.name}
                                className="w-16 h-16 object-contain rounded"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/60")}
                            />
                            <div>
                                <p className="text-gray-800 font-medium">{item.productId.name}</p>
                                <p className="text-gray-600">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                            ₹{item.productId.price * item.quantity}
                        </p>
                    </div>
                ))}

                <div className="flex justify-between mt-4 pt-4 border-t text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>

            <button
                onClick={handlePayment}
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block mx-auto"
            >
                Pay Now
            </button>
        </div>
    );
};

export default Checkout;
