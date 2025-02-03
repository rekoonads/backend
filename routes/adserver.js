import express from "express";

const router = express.Router();

router.post("/api/new-route", (req, res) => {
  const { userId, campaignId, strategyId, successPaymentId } = req.body;
  console.log("Received data:", {
    userId,
    campaignId,
    strategyId,
    successPaymentId,
  });

  return res.status(200).json({
    status: "success",
    message: "Data received successfully",
    data: { userId, campaignId, strategyId, successPaymentId },
  });
});

export default router;
