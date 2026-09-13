import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

import { requireAuth, requireAdmin } from "../middleware/auth.js"; 

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order (Checkout) → POST /api/payment/checkout
router.post('/checkout', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0)
            return res.status(400).json({ message: 'Cart is empty' });

        const amount = cart.products.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        ) * 100;

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        await Order.create({
            userId,
            products: cart.products,
            totalAmount: amount / 100, 
            orderId: razorpayOrder.id, 
            status: 'Created'
        });

        res.status(200).json(razorpayOrder); 

    } catch (err) {
        console.error('Checkout Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Payment Success → POST /api/payment/success
router.post('/success', requireAuth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id; 

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const order = await Order.findOne({ orderId: razorpay_order_id });
        if (order) {
            order.status = 'Paid';
            order.paymentId = razorpay_payment_id;
            await order.save();
        }

        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products = [];
            await cart.save();
        }

        res.status(200).json({ message: 'Payment successful', order });
    } catch (err) {
        console.error('Payment Success Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get All Orders → GET /api/payment/orders
router.get('/orders', requireAuth, requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.status(200).json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;