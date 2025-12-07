import React, { useEffect, useState, useContext } from "react";
import { getAllOrders } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Orders = () => {
    const { user } = useContext(AuthContext);
    const userId = user?._id || user?.id;
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const fetchOrders = async () => {
            try {
                const allOrders = await getAllOrders();
                // Filter orders for logged-in user
                const userOrders = allOrders.filter(
                    (order) => order.userId === userId || order.userId?._id === userId
                );
                setOrders(userOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, [userId]);

    if (!userId) return <p className="text-center mt-6">Please login to view your orders.</p>;
    if (orders.length === 0)
        return <p className="text-center mt-6 text-gray-700">No orders found.</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Orders</h1>

            <div className="flex flex-col gap-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded-lg shadow p-4 bg-white"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="font-semibold">Order ID: {order._id}</p>
                                <p className="text-gray-600">
                                    Status:{" "}
                                    <span
                                        className={`font-bold ${order.status === "paid" ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {order.status || "Pending"}
                                    </span>
                                </p>
                            </div>
                            <p className="font-semibold text-gray-800">
                                Total: ₹{order.totalAmount}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {order.products.map((item) => (
                                <div
                                    key={item.productId._id}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.productId.imageUrl || "https://via.placeholder.com/50"}
                                            alt={item.productId.name}
                                            className="w-12 h-12 object-contain rounded"
                                        />
                                        <div>
                                            <p className="text-gray-800">{item.productId.name}</p>
                                            <p className="text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        ₹{item.productId.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
