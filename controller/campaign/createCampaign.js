import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
    const campaignData = req.body;
    console.log("Campaign data for update:", campaignData);

    if (campaignData.startDate) {
      campaignData.startDate = new Date(campaignData.startDate);
    }
    if (campaignData.endDate) {
      campaignData.endDate = new Date(campaignData.endDate);
    }

    const currentDate = new Date();
    if (campaignData.startDate && campaignData.endDate) {
      const startDate = campaignData.startDate;
      const endDate = campaignData.endDate;

      if (currentDate >= startDate && currentDate <= endDate) {
        campaignData.status = "active";
      } else if (currentDate < startDate) {
        campaignData.status = "scheduled";
      } else {
        campaignData.status = "expired";
      }
    }

    const existingCampaign = await Campaignmodel.findOne({
      campaignId: campaignData.campaignId,
    });
    let savedCampaign;

    if (existingCampaign) {
      savedCampaign = await Campaignmodel.findByIdAndUpdate(
        existingCampaign._id,
        campaignData,
        {
          new: true,
          runValidators: true,
        }
      );
      console.log("Campaign updated:", savedCampaign);
    } else {
      const campaign = new Campaignmodel(campaignData);
      savedCampaign = await campaign.save();
      console.log("Campaign created:", savedCampaign);
    }

    // Ensure status is updated correctly
    await savedCampaign.updateStatus();

    return res.status(201).json(savedCampaign);
  } catch (err) {
    console.error("Error saving campaign:", err);
    return res.status(400).json({ error: err.message });
  }
};
