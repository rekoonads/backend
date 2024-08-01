import Strategy from "../../models/Strategy.js";

export default async (req, res) => {
    try {
      const updatedCampaign = await Strategy.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
      );
  
      return !updatedCampaign
        ? res.status(404).json({ message: "Strategy details notfound" })
        : res.status(200).json(updatedCampaign);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
