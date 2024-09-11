import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
    const campaignId = req.query.campaignId;
    const advertisers = await Campaignmodel.findOneAndDelete(campaignId);
    return advertisers ? res.status(200).json({message: `Deletion is Successful`}) : res.status(500).json({message: `Server is down`})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
