import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { requireAuth } from "../middleware/auth.js"; // ✅ import auth middleware
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Razorpay with keys from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/create-order", requireAuth, createOrder);
router.post("/verify", requireAuth, verifyPayment);

/* 🟢 Create Razorpay Order (Checkout) → POST /api/payment/checkout */
router.post('/checkout', async (req, res) => {
    try {
        const { userId } = req.body;

        // Fetch user's cart
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0)
            return res.status(400).json({ message: 'Cart is empty' });

        // Calculate total amount (in paise)
        const amount = cart.products.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        ) * 100;

        // Create Razorpay order
        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);

    } catch (err) {
        console.error('Checkout Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/* 🟢 Payment Success → POST /api/payment/success */
router.post('/success', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

        // Verify payment signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature)
            return res.status(400).json({ message: 'Invalid signature' });

        // Get cart and calculate total
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        const totalAmount = cart.products.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        );

        // Create order in DB
        const order = await Order.create({
            userId,
            products: cart.products,
            totalAmount,
            paymentId: razorpay_payment_id,
        });

        // Clear cart
        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Payment successful', order });
    } catch (err) {
        console.error('Payment Success Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/* 📦 Get All Orders → GET /api/payment/orders (for testing) */
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.status(200).json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
