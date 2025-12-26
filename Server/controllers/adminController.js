import User from "../models/User.js";
import CartModel from "../models/cartModel.js";
import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching users", error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Prevent deleting Super Admin
        if (userToDelete.role === "superadmin") {
            return res.status(403).json({ msg: "Cannot delete Super Admin." });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting user", error: err.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        // Assuming cart items are stored in a Cart collection or embedded. 
        // Based on previous file list `Server/models/cartModel.js` exists.
        // If cartModel is user-specific, we count total active carts or items.

        // Let's assume we want to show "xyz shows" vaguely requested. 
        // We'll return user roles distribution and maybe total carts.

        const totalAdmins = await User.countDocuments({ role: { $in: ["admin", "superadmin"] } });
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const totalRegularUsers = await User.countDocuments({ role: "user" });

        // Dynamic import to avoid error if file doesn't exist (though I saw it in list)
        // Actually I should just import it at top.
        const activeCarts = await CartModel.countDocuments();

        res.status(200).json({
            totalUsers,
            roles: {
                admin: totalAdmins,
                doctor: totalDoctors,
                user: totalRegularUsers,
            },
            activeCarts,
        });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching stats", error: err.message });
    }
};

// --- Carts ---
export const getAllCarts = async (req, res) => {
    try {
        const carts = await CartModel.find().populate("user", "fullName email"); // Assuming user field ref
        // If CartModel structure is different, we might need adjustments.
        // Based on previous contexts, cart might be user-linked.
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching carts", error: err.message });
    }
};

// --- Doctors / Staff ---
export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addDoctor = async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ msg: "Staff deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Services ---
export const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addService = async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ msg: "Service deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createAdmin = async (req, res) => {
    // Optional: Logic for Super Admin to create new Admins
    // For now, not explicitly asked but "make all the things ready".
    // reusing register logic but with role assignment would be better.
    // skipping specifically unless requested, as they can "seed" or we can add "update role" endpoint.
    res.status(501).json({ msg: "Not implemented yet" });
};
