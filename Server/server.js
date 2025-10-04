// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import profileRoutes from "./routes/profile.js";
import geminiRoute from "./gemini.js";
import medibotRoute from "./routes/medibot.js"; // ✅ Added AI route

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Enable CORS properly
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Parse JSON and URL-encoded bodies
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("🩺 MediNova Backend Running ✅");
});

// ✅ App Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", geminiRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/medibot", medibotRoute); // ✅ Integrated AI route

// ✅ Global Error Handler (optional, clean fallback)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
