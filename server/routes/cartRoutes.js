import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

/* 🛒 1️⃣ Add Product to Cart → POST /api/cart/add */
router.post("/add", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }],
            });
        } else {
            const index = cart.products.findIndex(
                (p) => p.productId.toString() === productId
            );

            if (index > -1) {
                cart.products[index].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* 🧾 2️⃣ Get User Cart → GET /api/cart/:userId */
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
            .populate("products.productId");

        if (!cart) return res.status(200).json({ products: [] });

        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* 🔁 3️⃣ Update Quantity → PUT /api/cart/update */
router.put("/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const product = cart.products.find(
            (p) => p.productId.toString() === productId
        );

        if (!product)
            return res.status(404).json({ message: "Product not found in cart" });

        product.quantity = quantity;

        await cart.save();

        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* ❌ 4️⃣ Delete Product → DELETE /api/cart/delete/:userId/:productId */
router.delete("/delete/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(
            (p) => p.productId.toString() !== productId
        );

        await cart.save();

        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* 🧹 5️⃣ Clear Cart → DELETE /api/cart/clear/:userId */
router.delete("/clear/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = [];

        await cart.save();

        res.status(200).json({ message: "Cart cleared" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
