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
    campaignId,
    mediaType,
    bannerSize,
    bannerFormat,
    bannerClickThroughUrl,
    adTitle,
    adDescription,
    callToAction,
    // New bidding fields
    currentBid,
    biddingType,
  } = req.body;

  console.log(`User Sent Data : `, req.body);

  try {
    let strategy = await Strategy.findOne({ strategyId });

    if (strategy) {
      const updatedStrategy = await Strategy.findOneAndUpdate(
        { strategyId },
        {
          $set: {
            ...req.body,
            currentBid: currentBid || strategy.currentBid,
            biddingType: biddingType || strategy.biddingType,
          },
        },
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
        campaignId,
        mediaType,
        bannerSize,
        bannerFormat,
        bannerClickThroughUrl,
        adTitle,
        adDescription,
        callToAction,
        currentBid: currentBid || 0,
        biddingType: biddingType || "manual",
      });
      console.log("new strategy data :- ", newStrategy);
      const savedStrategy = await newStrategy.save();
      return res.status(201).json({ savedStrategy });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
