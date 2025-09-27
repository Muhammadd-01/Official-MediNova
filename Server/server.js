const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Pharmacy API running 🚀");
});

// Checkout route
app.post("/api/checkout", (req, res) => {
  const { user, items, total } = req.body;

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Cart is empty" });
  }

  console.log("🛒 New Order Received:");
  console.log("User Info:", user);
  console.log("Items:", items);
  console.log("Total:", total);

  // TODO: Save order in DB here

  res.json({ success: true, message: "Order placed successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
