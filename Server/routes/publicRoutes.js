import express from "express";
import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";

const router = express.Router();

// Get All Doctors/Staff
router.get("/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get All Services
router.get("/services", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
