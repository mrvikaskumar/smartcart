import axios from "axios";

// Centralized secure Axios instance
export const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // Mandatory for HttpOnly cookies
});

// -------------------- Products --------------------

export const getAllProducts = async () => {
    try {
        const res = await apiClient.get("/products");
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const res = await apiClient.get(`/products/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const createProduct = async (formData) => {
    try {
        const res = await apiClient.post("/products/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err) {
        console.error("Error creating product:", err.response?.data || err.message);
        throw err.response?.data || err;
    }
};

export const updateProduct = async (id, formData) => {
    try {
        const res = await apiClient.put(`/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err) {
        console.error("Error updating product:", err.response?.data || err.message);
        throw err.response?.data || err;
    }
};

export const deleteProduct = async (id) => {
    try {
        const res = await apiClient.delete(`/products/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// -------------------- Cart --------------------

export const getCart = async (userId) => {
    try {
        const res = await apiClient.get(`/cart/${userId}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching cart:", err);
        return null;
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const res = await apiClient.post("/cart/add", { userId, productId, quantity });
        return res.data;
    } catch (err) {
        console.error("Error adding to cart:", err);
        return null;
    }
};

export const updateCart = async (userId, productId, quantity) => {
    try {
        const res = await apiClient.put("/cart/update", { userId, productId, quantity });
        return res.data;
    } catch (err) {
        console.error("Error updating cart:", err);
        return null;
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const res = await apiClient.delete(`/cart/delete/${userId}/${productId}`);
        return res.data;
    } catch (err) {
        console.error("Error removing from cart:", err);
        return null;
    }
};

export const clearCart = async (userId) => {
    try {
        const res = await apiClient.delete(`/cart/clear/${userId}`);
        return res.data;
    } catch (err) {
        console.error("Error clearing cart:", err);
        return null;
    }
};

// -------------------- Payment --------------------

export const createCheckout = async (userId) => {
    try {
        const res = await apiClient.post("/payment/checkout", { userId });
        return res.data;
    } catch (err) {
        console.error("Error creating checkout:", err);
        return null;
    }
};

export const paymentSuccess = async (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
        const res = await apiClient.post("/payment/success", {
            userId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });
        return res.data;
    } catch (err) {
        console.error("Error completing payment:", err);
        return null;
    }
};

export const getAllOrders = async () => {
    try {
        const res = await apiClient.get("/payment/orders");
        return res.data;
    } catch (err) {
        console.error("Error fetching orders:", err);
        return [];
    }
};