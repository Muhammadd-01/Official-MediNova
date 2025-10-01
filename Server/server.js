// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import geminiRoute from "./gemini.js"; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS properly
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

// Root test route
app.get("/", (req, res) => {
  res.send("MediNova Backend Running ✅");
});

// Test ping route
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", geminiRoute); 

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
