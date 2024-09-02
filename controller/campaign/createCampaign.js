import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
          const campaignData = req.body;

          console.log("Campaign data for update:", campaignData);
          const existingCampaign = await Campaignmodel.findOne({ campaignId: campaignData.campaignId });
          let savedCampaign;
          console.log("exist campaign is :- ",existingCampaign)

          if (existingCampaign) {
            savedCampaign = await Campaignmodel.findByIdAndUpdate(existingCampaign._id, campaignData, {
              new: true, 
              runValidators: true
            });
            console.log("Campaign updated:", savedCampaign);
          } else {
            const campaign = new Campaignmodel(campaignData);
            savedCampaign = await campaign.save();
            console.log("Campaign created:", savedCampaign);
          }

          return res.status(201).json(savedCampaign);
  } catch (err) {
    console.error("Error saving campaign:", err);
    return res.status(400).json({ error: err.message });
  }
};
