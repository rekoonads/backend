import ErrorModel from "../models/ErrorModel.js";

export default async (req, res) => {
  try {
    const { errorId, userId, campaignId, strategyId, errorMessage } = req.body;
    
    const newError = new ErrorModel({
      errorId,
      userId,
      campaignId,
      strategyId,
      errorMessage,
    });
    await newError.save();

    res.status(201).json({ message: 'Error logged successfully' });
  } catch (err) {
    console.error("Error saving error:", err);
    return res.status(400).json({ error: err.message });
  }
};
