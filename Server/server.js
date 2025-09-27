const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mock payment processing endpoint
app.post("/process-payment", (req, res) => {
  const { items, paymentMethod, paymentDetails, total } = req.body;
  console.log("Received order:", { items, paymentMethod, paymentDetails, total });
  
  // Simulate successful payment processing
  res.json({
    success: true,
    message: `Payment processed successfully via ${paymentMethod}`,
    orderId: `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));