import express from "express";
import { testEmailService } from "../utils/emailService.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    const info = await testEmailService();
    res.status(200).json({ message: "Test email sent successfully", info });
  } catch (error) {
    console.error("Error sending test email:", error);
    res
      .status(500)
      .json({ message: "Error sending test email", error: error.message });
  }
});

export default router;
