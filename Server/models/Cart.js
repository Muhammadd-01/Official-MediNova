// models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  name: String,
  price: Number,
  discount: Number,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Cart", cartSchema);
