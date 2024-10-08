import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    console.log(advertiserId)

    const campaigns = await Campaignmodel.find({advertiserId : advertiserId});
    return campaigns
      ? res.status(200).json(campaigns)
      : res.status(503).json({ message: `No Campaigns Created` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
