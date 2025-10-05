import express from "express";
const router = express.Router();

// Example: You’ll store real QR URLs or payment links later in DB/env
router.get("/donation-qr", (req, res) => {
  res.json({
    jazzcash: "/assets/donation-qr-jazzcash.png",
    easypaisa: "/assets/donation-qr-easypaisa.png",
    payoneer: "/assets/donation-qr-payoneer.png",
  });
});

// Optional: if you want to log donations
router.post("/donate", async (req, res) => {
  const { name, method, amount } = req.body;
  console.log(`Donation received from ${name || "Anonymous"} via ${method}: PKR ${amount}`);
  res.json({ message: "Donation logged successfully" });
});

export default router;
