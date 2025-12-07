import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token. Unauthorized." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required." });
    }
    next();
};
