import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.role !== "admin" && user.role !== "superadmin") {
            return res.status(403).json({ msg: "Access denied. Admins only." });
        }

        req.user.role = user.role; // Attach role for next middleware if needed
        next();
    } catch (err) {
        res.status(500).json({ msg: "Server error checking admin status" });
    }
};

export const isSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.role !== "superadmin") {
            return res.status(403).json({ msg: "Access denied. Super Admin only." });
        }

        req.user.role = user.role;
        next();
    } catch (err) {
        res.status(500).json({ msg: "Server error checking super admin status" });
    }
};
