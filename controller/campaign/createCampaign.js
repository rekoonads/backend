import Campaignmodel from "../../models/Campaign.js";

export default async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const campaignData = req.body;

    
    // const existingCampaign = await Campaignmodel.findOne({ userId: campaignData.userId });
    
    // if (existingCampaign) {
    
    //   return res.status(404).json({ status: false, message: "Campaign already exists" });
    // } else {
      
      const campaign = new Campaignmodel(campaignData);
      const savedCampaign = await campaign.save();
      return res.status(201).json(savedCampaign);
    // }
  } catch (err) {
    console.error("Error saving campaign:", err);
    return res.status(400).json({ error: err.message });
  }
};
