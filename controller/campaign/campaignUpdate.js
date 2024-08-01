import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
    const updatedCampaign = await Campaignmodel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );

    return !updatedCampaign
      ? res.status(404).json({ message: "Campaign details not found" })
      : res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
