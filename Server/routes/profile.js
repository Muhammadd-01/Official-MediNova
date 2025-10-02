// profile.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Setup multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/profilePics";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      req.user.id + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// GET current user info
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE current user info
router.put("/update", verifyToken, upload.single("profilePic"), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      dob,
      bloodGroup,
      allergies,
      medications,
      history,
      password,
    } = req.body;

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (allergies) updateData.allergies = allergies;
    if (medications) updateData.medications = medications;
    if (history) updateData.history = history;

    // Handle password update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Handle profile picture upload
    if (req.file) {
      updateData.profilePic = `/uploads/profilePics/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
