import Advertisermodel from "../../models/Advertiser.js";

export default async (req, res) => {
  try {
    const userId = req.params;
    const strategy = await Advertisermodel.findOne(userId);
    return strategy
      ? res.status(200).json(strategy)
      : res.status(503).json({ message: `No Data Found` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};