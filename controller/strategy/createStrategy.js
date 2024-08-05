import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
  const newStrategy = new Strategy({
    userId: req.body.userId,
    strategyId: req.body.strategyId,
    strategyName: req.body.strategyName,
    strategyDailyBudget: req.body.strategyDailyBudget,
    selectedGoal: req.body.selectedGoal,
    selectedOption: req.body.selectedOption,
    selectedChannels: req.body.selectedChannels,
    ageRange: req.body.ageRange,
    gender: req.body.gender,
    screens: req.body.screens,
    audiences: req.body.audiences,
    deliveryTimeSlots: req.body.deliveryTimeSlots,
    creatives: req.body.creatives,
    campaignId: req.body.campaignId
  });
  console.log(`User Sent Data : `, req.body)
  try {
    const savedStrategy = await newStrategy.save();
    if(savedStrategy){
      return res.status(201).json({savedStrategy})
    } else {
      return res.status(403).json({message: `Unable to create`})
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
