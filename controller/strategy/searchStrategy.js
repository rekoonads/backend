import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
  try {
    const strategyId = req.query.strategyId;
    console.log("searched strategy : - ", strategyId)
    const strategy = await Strategy.findOne({ strategyId });
    if (!strategy) return res.status(404).send('Strategy not found');
    res.json(strategy);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
