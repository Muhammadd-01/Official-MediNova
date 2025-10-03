import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Cart from "../models/cartModel.js";

const router = express.Router();

// GET cart for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add item to cart
router.post("/", verifyToken, async (req, res) => {
  const { fdaId, name, manufacturer, dosage, quantity, price } = req.body;

  if (!fdaId || !name) {
    return res.status(400).json({ error: "Medicine ID and name required" });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if item already exists
    const existingItem = cart.items.find(item => item.fdaId === fdaId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ fdaId, name, manufacturer, dosage, quantity: quantity || 1, price: price || 0 });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update quantity
router.patch("/:itemId", verifyToken, async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove item
router.delete("/:itemId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items.id(req.params.itemId).remove();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
