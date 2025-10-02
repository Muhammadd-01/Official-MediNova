// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // optional if you want to link to user
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
