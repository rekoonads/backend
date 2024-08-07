import Bill from '../../models/Bill.js'; 

export default async (req, res) => {
    const { userId, campaignId, strategyId, successPaymentId } = req.body;

  try {
    // Create the bill document
    const newBill = await Bill.create({ userId,campaignId, strategyId, successPaymentId });

    // Populate the references
    const populatedBill = await Bill.findById(newBill._id)
      .populate('campaignId')
      .populate('strategyId');

    // Respond with the populated document
    return res.status(201).json(populatedBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    return res.status(400).json({ message: error.message });
  }
};
