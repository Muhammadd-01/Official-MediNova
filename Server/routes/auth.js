// routes/auth.js
import express from "express";
import User from "../models/User.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    // Make sure body exists
    if (!req.body) return res.status(400).json({ msg: "No data sent" });

    const { 
      fullName, 
      email, 
      password, 
      dateOfBirth, 
      phoneNumber, 
      gender, 
      country, 
      termsAccepted 
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "Full name, email, and password are required" });
    }

    // ✅ Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // ✅ Check if phone number exists
    if (phoneNumber) {
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(400).json({ msg: "Phone number already registered" });
      }
    }

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


// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// POST /api/auth/social-login
router.post("/social-login", async (req, res) => {
  try {
    const { fullName, email, authProvider, auth0Id } = req.body;

    if (!email || !auth0Id || !authProvider) {
      return res.status(400).json({ msg: "Missing social login data" });
    }

    // Check if user already exists (by Auth0 ID)
    let user = await User.findOne({ auth0Id });
    if (!user) {
      // Create new user
      user = new User({
        fullName,
        email,
        authProvider, // google/facebook/twitter
        auth0Id,
      });
      await user.save();
    }

    // Issue JWT token like normal login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      msg: "Social login successful",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Social login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
