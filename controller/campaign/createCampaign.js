import Campaignmodel from '../../models/Campaign.js'

export default async (req, res) => {
    const newCampaign = new Campaignmodel({
      userId: req.body.userId,
      campaignId: req.body.campaignId,
      campaignName: req.body.campaignName,
      campaignGoal: req.body.campaignGoal,
      campaignAdvertiserBudget: req.body.campaignAdvertiserBudget,
      campaignWeeklyBudget: req.body.campaignWeeklyBudget,
      campaignDailyBudget: req.body.campaignDailyBudget,
      campaignBudget: req.body.campaignBudget,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
  
    try {
      const savedCampaign = await newCampaign.save();
      return savedCampaign ? res.status(201).json(savedCampaign) : res.status(400).json({message: `Incomplete Data or Inappropriate Data`});
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };