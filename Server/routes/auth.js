import express from "express";
import User from "../models/User.js"; // your Mongoose model
import bcrypt from "bcryptjs";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, dateOfBirth, phoneNumber, gender, country, termsAccepted } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      dateOfBirth,
      phoneNumber,
      gender,
      country,
      termsAccepted,
    });

    await newUser.save();

    res.status(201).json({ msg: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
