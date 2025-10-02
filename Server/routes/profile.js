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
      profilePic, // <-- frontend sends "" if user removed pic
    } = req.body;

    const updateData = {
      fullName: fullName !== undefined ? fullName : undefined,
      email: email !== undefined ? email : undefined,
      phone: phone !== undefined ? phone : undefined,
      gender: gender !== undefined ? gender : undefined,
      dob: dob !== undefined ? dob : undefined,
      bloodGroup: bloodGroup !== undefined ? bloodGroup : undefined,
      allergies: allergies !== undefined ? allergies : undefined,
      medications: medications !== undefined ? medications : undefined,
      history: history !== undefined ? history : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Handle password update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Handle profile picture upload
    if (req.file) {
      // Delete old picture from disk if exists
      const user = await User.findById(req.user.id);
      if (user.profilePic) {
        const oldPath = path.join(".", user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profilePic = `/uploads/profilePics/${req.file.filename}`;
    } else if (profilePic === "") {
      // Remove profile picture from DB and disk
      const user = await User.findById(req.user.id);
      if (user.profilePic) {
        const oldPath = path.join(".", user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profilePic = "";
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
