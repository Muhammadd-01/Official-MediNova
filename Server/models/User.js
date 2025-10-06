// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    authProvider: { type: String }, // google/facebook/twitter
    auth0Id: { type: String, unique: true, sparse: true }, // unique Auth0 ID
    phoneNumber: { type: String },
    gender: { type: String },
    country: { type: String },

    // ✅ Add role field here
    role: {
      type: String,
      enum: ["user", "doctor", "admin", "superadmin"],
      default: "user",
    },

    // Profile fields
    profilePic: { type: String }, // store image URL/path
    dob: { type: Date },          // date of birth
    bloodGroup: { type: String },
    allergies: { type: String },
    medications: { type: String },
    history: { type: String },    // medical history
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
