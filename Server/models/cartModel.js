import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  fdaId: { type: String, required: true }, // FDA medicine ID
  name: { type: String, required: true },
  manufacturer: { type: String },
  dosage: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 }, // optional if you fetch price
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
