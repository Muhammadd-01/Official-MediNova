import express from "express";
import {
    getAllUsers,
    deleteUser,
    getDashboardStats,
    getAllCarts,
    getDoctors,
    addDoctor,
    deleteDoctor,
    getServices,
    addService,
    deleteService
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin, isSuperAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Protect all routes
router.use(verifyToken);
router.use(isAdmin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin/SuperAdmin
router.get("/users", getAllUsers);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin/SuperAdmin (SuperAdmin protection handled in controller)
router.delete("/users/:id", deleteUser);

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Admin/SuperAdmin
router.get("/stats", getDashboardStats);

// --- Carts ---
router.get("/carts", getAllCarts);

// --- Staff (Doctors/Nurses) ---
router.get("/doctors", getDoctors);
router.post("/doctors", addDoctor); // Add validation if needed
router.delete("/doctors/:id", deleteDoctor);

// --- Services ---
router.get("/services", getServices);
router.post("/services", addService);
router.delete("/services/:id", deleteService);

export default router;
