import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try { // Get campaignId from query parameters
    const { campaignId, campaignName } = req.body;

    if (!campaignId) {
      return res.status(400).json({ message: "campaignId is required" });
    }

    // Find the campaign by campaignId and update it
    const updatedCampaign = await Campaignmodel.findOneAndUpdate(
      { campaignId: campaignId }, // Find the campaign by campaignId
      {campaignName}, // Data to update the campaign with
      { new: true } // Return the updated document
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    return res.status(200).json({ message: "Campaign updated successfully", updatedCampaign });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
