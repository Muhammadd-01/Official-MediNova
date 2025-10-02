// routes/feedbackRoutes.js
import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// Create new feedback
router.post("/", async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) return res.status(400).json({ message: "Feedback is required" });

    const newFeedback = new Feedback({ feedback });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Optional: Get all feedbacks (for admin)
router.get("/", async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(allFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
