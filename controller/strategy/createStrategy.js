import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
  const newStrategy = new Strategy({
    strategyId: req.body.strategyId,
    strategyName: req.body.strategyName,
    strategyDailyBudget: req.body.strategyDailyBudget,
    ageRange: req.body.ageRange,
    gender: req.body.gender,
    screens: req.body.screens,
    audiences: req.body.audiences,
    deliveryTimeSlots: req.body.deliveryTimeSlots,
    creatives: req.body.creatives,
  });

  try {
    const savedStrategy = await newStrategy.save();
    return savedStrategy
      ? res.status(201).json({
          savedStrategy,
        })
      : res.status(401).json({ message: `Unable to Create` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
