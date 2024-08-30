import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
    const campaignId = req.query.campaignId;
    console.log("searched campaign : - ", campaignId)
    const campaign = await Campaignmodel.findOne({ campaignId });
    if (!campaign) return res.status(404).send('Campaign not found');
    res.json(campaign);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
