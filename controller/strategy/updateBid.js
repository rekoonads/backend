import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
  const { strategyId } = req.params;
  const { currentBid, biddingType } = req.body;

  try {
    const updatedStrategy = await Strategy.findOneAndUpdate(
      { strategyId },
      { $set: { currentBid, biddingType } },
      { new: true }
    );

    if (!updatedStrategy) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    res.json(updatedStrategy);
  } catch (error) {
    console.error("Error updating bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
