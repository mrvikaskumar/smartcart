import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// --------- Products ---------
export const getAllProducts = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/products`);
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const createProduct = async (formData) => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.post(`${BASE_URL}/products/add`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem("adminToken");
        const res = await axios.put(`${BASE_URL}/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem("adminToken");
        const res = await axios.delete(`${BASE_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};


// -------------------- Cart --------------------

// 1️⃣ Get user cart
export const getCart = async (userId) => {
    try {
        const res = await axios.get(`${BASE_URL}/cart/${userId}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching cart:", err);
        return null;
    }
};

// 2️⃣ Add product to cart
export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const res = await axios.post(`${BASE_URL}/cart/add`, { userId, productId, quantity });
        return res.data;
    } catch (err) {
        console.error("Error adding to cart:", err);
        return null;
    }
};

// 3️⃣ Update cart product quantity
export const updateCart = async (userId, productId, quantity) => {
    try {
        const res = await axios.put(`${BASE_URL}/cart/update`, { userId, productId, quantity });
        return res.data;
    } catch (err) {
        console.error("Error updating cart:", err);
        return null;
    }
};

// 4️⃣ Remove product from cart
export const removeFromCart = async (userId, productId) => {
    try {
        const res = await axios.delete(`${BASE_URL}/cart/delete/${userId}/${productId}`);
        return res.data;
    } catch (err) {
        console.error("Error removing from cart:", err);
        return null;
    }
};

// 5️⃣ Clear entire cart
export const clearCart = async (userId) => {
    try {
        const res = await axios.delete(`${BASE_URL}/cart/clear/${userId}`);
        return res.data;
    } catch (err) {
        console.error("Error clearing cart:", err);
        return null;
    }
};

// -------------------- Payment --------------------

// 1️⃣ Create Razorpay checkout
export const createCheckout = async (userId) => {
    try {
        const res = await axios.post(`${BASE_URL}/payment/checkout`, { userId });
        return res.data;
    } catch (err) {
        console.error("Error creating checkout:", err);
        return null;
    }
};

// 2️⃣ Payment success
export const paymentSuccess = async (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
        const res = await axios.post(`${BASE_URL}/payment/success`, {
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

// 3️⃣ Get all orders
export const getAllOrders = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/payment/orders`);
        return res.data;
    } catch (err) {
        console.error("Error fetching orders:", err);
        return [];
    }
};
