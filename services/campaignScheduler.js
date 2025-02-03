import cron from "node-cron";
import Campaign from "../models/Campaign.js";

class CampaignScheduler {
  constructor() {
    // Run every hour
    this.job = cron.schedule("* * * * *", () => {
      this.updateCampaignStatuses();
    });
  }

  async updateCampaignStatuses() {
    const now = new Date();
    try {
      // Activate scheduled campaigns
      await Campaign.updateMany(
        {
          status: "scheduled",
          startDate: { $lte: now },
        },
        { $set: { status: "active" } }
      );

      // Expire active campaigns
      await Campaign.updateMany(
        {
          status: "active",
          endDate: { $lte: now },
        },
        { $set: { status: "expired" } }
      );

      console.log("Campaign statuses updated successfully");
    } catch (error) {
      console.error("Error updating campaign statuses:", error);
    }
  }

  start() {
    this.job.start();
    console.log("Campaign scheduler started");
  }

  stop() {
    this.job.stop();
    console.log("Campaign scheduler stopped");
  }
}

export default new CampaignScheduler();
