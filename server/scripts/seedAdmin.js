import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // <-- make sure path points to server/.env

import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const existing = await Admin.findOne({ email: "vikasgr01@gmail.com" });
        if (existing) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const admin = new Admin({
            name: "Admin",
            email: "vikasgr01@gmail.com",
            password: "admin123"
        });

        await admin.save();
        console.log("Admin created successfully");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
