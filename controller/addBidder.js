import Bidder from "../models/bidder.js";

export default async (req, res) => {
  try {
    const {
      agencyId,
      advertiserId,
      deliveryTimeSlots,
      campaignBudget,
      reviveUrl,
      audiences,
      startDate,
      endDate,
      status
    } = req.body;
   

    const newBidder = new Bidder({
      agencyId,
      advertiserId,
      deliveryTimeSlots,
      campaignBudget,
      reviveUrl,
      audiences,
      startDate,
      endDate,
      status
    });
    const savedbidder = await newBidder.save();
    console.log(savedbidder);
    if (savedbidder) {
      return res.status(201).json({ savedbidder });
    } else {
      return res.status(403).json({ message: `Unable to create` });
    }
  } catch (err) {
    console.error("Error saving bidder:", err);
    return res.status(400).json({ error: err.message });
  }
};
