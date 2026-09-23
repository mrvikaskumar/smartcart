import express from "express";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const admin = await Admin.findOne({ email });
        
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: admin._id, role: admin.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );

        // Send token in an HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        return res.status(200).json({
            message: "Admin login successful",
            name: admin.name,
            email: admin.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;