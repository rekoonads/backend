import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
  const {
    userId,
    strategyId,
    agencyId,
    strategyName,
    strategyDailyBudget,
    selectedGoal,
    selectedOption,
    selectedChannels,
    ageRange,
    gender,
    screens,
    audiences,
    deliveryTimeSlots,
    audienceLocation,
    deliveryType,
    creatives,
    duration,
    campaignId
  } = req.body;

  console.log(`User Sent Data : `, req.body);

  try {
    // Check if a strategy with the given strategyId exists
    let strategy = await Strategy.findOne({ strategyId });

    if (strategy) {
      const updatedStrategy = await Strategy.findOneAndUpdate(
        { strategyId },
        { $set: req.body },
        { new: true } 
      );
      return res.status(200).json({ updatedStrategy });
    } else {
      const newStrategy = new Strategy({
        userId,
        strategyId,
        agencyId,
        strategyName,
        strategyDailyBudget,
        selectedGoal,
        selectedOption,
        selectedChannels,
        ageRange,
        gender,
        screens,
        audiences,
        deliveryTimeSlots,
        audienceLocation,
        deliveryType,
        creatives,
        duration,
        campaignId
      });
      console.log("new strategy data :- ",newStrategy)
      const savedStrategy = await newStrategy.save();
      return res.status(201).json({ savedStrategy });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
