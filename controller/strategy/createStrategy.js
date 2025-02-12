import Strategy from "../../models/Strategy.js";
import Demographics from "../../models/Demographics.js";
import FilteredStrategy from "../../models/FilteredStrategy.js";

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
    targetedAgeGroups, // Added targetedAgeGroups
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
    currentBid,
    biddingType,
  } = req.body;

  console.log(`User Sent Data : `, req.body);

  try {
    const ageQueries = targetedAgeGroups.map((range) => {
      const [min, max] = range.split("-").map(Number);
      return { age: { $gte: min, $lte: max } };
    });
    console.log(gender);
    const query = {
      $or: ageQueries,
      gender: gender,
      interests: { $in: audiences }, // Match any of the interests
    };
    const targetedDemographics = await Demographics.find(query);
    console.log("Targeted Demographics:", targetedDemographics);
    const newFilteredStrategy = new FilteredStrategy({
      strategyId,
      userId,
      demographics: targetedDemographics,
    });
    await newFilteredStrategy.save();

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
