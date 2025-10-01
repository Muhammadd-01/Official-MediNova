// routes/cart.js
import express from "express";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/verifyToken.js";// your JWT middleware

const router = express.Router();

// Get current user's cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add or update item in cart
router.post("/", verifyToken, async (req, res) => {
  const { medicineId, name, price, discount, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.medicineId.toString() === medicineId
    );

    if (itemIndex > -1) {
      // If item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ medicineId, name, price, discount, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/:medicineId", verifyToken, async (req, res) => {
  const { medicineId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.medicineId.toString() !== medicineId
    );
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
