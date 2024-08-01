import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
  try {
    const userId = req.params;
    const strategy = await Strategy.findOneAndDelete(userId);
    return strategy ? res.status(200).json({message: `Deletion is Successful`}) : res.status(500).json({message: `Server is down`})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};