import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Register user or admin
router.post("/register", register);

// Login user or admin
router.post("/login", login);

export default router;
