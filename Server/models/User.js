// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    authProvider: { type: String }, // google/facebook/twitter
  auth0Id: { type: String, unique: true, sparse: true }, // unique Auth0 ID
  dateOfBirth: Date,
  phoneNumber: String,
  gender: String,
  country: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
