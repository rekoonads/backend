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
      strategy.userId = userId;
      strategy.agencyId = agencyId;
      strategy.strategyName = strategyName;
      strategy.strategyDailyBudget = strategyDailyBudget;
      strategy.selectedGoal = selectedGoal;
      strategy.selectedOption = selectedOption;
      strategy.selectedChannels = selectedChannels;
      strategy.ageRange = ageRange;
      strategy.gender = gender;
      strategy.screens = screens;
      strategy.audiences = audiences;
      strategy.deliveryTimeSlots = deliveryTimeSlots;
      strategy.audienceLocation = audienceLocation;
      strategy.deliveryType = deliveryType;
      strategy.creatives = creatives;
      strategy.duration = duration;
      strategy.campaignId = campaignId;

      const updatedStrategy = await strategy.save();
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

      const savedStrategy = await newStrategy.save();
      return res.status(201).json({ savedStrategy });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
