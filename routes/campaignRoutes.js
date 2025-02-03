import express from "express";
import Campaignmodel from "../models/Campaign.js";

const router = express.Router();

router.get("/:campaignId/status", async (req, res) => {
  try {
    const campaign = await Campaignmodel.findOne({
      campaignId: req.params.campaignId,
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    await campaign.updateStatus();

    const now = new Date();
    let remainingTime = null;

    if (campaign.status === "active") {
      remainingTime = new Date(campaign.endDate).getTime() - now.getTime();
    } else if (campaign.status === "scheduled") {
      remainingTime = new Date(campaign.startDate).getTime() - now.getTime();
    }

    res.json({
      status: campaign.status,
      remainingTime: remainingTime ? Math.floor(remainingTime / 1000) : null, // Convert to seconds
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      currentTime: now.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
