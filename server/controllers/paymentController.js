// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js"; // create Order model next

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in smallest currency unit (paise)
        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
        };
        const order = await razorpay.orders.create(options);

        // save order in database
        const newOrder = await Order.create({
            user: req.user._id,
            orderId: order.id,
            amount: amount,
            status: "created",
        });

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Verify payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        // update order status
        const order = await Order.findOne({ orderId: razorpay_order_id });
        order.status = "paid";
        order.paymentId = razorpay_payment_id;
        await order.save();

        res.status(200).json({ message: "Payment verified successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
