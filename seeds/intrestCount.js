import Demographics from "../models/Demographics.js";

export const getInterestCounts = async (req, res) => {
  try {
    const interestCounts = await Demographics.aggregate([
      { $unwind: "$interests" },
      { $group: { _id: "$interests", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(interestCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
