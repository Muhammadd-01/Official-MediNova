// models/Medicine.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicineId: { type: String, required: true, unique: true }, // FDA API unique ID
  name: String,
  price: Number,
  discount: Number,
  stock: { type: Number, default: 100 }, // optional
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Medicine", medicineSchema);
