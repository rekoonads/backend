import Bill from '../../models/Bill.js'; 
import {openPage} from '../../utils/seleniumScript.js';
export default async (req, res) => {
    const { userId, campaignId, strategyId, successPaymentId } = req.body;

  try {
    // Create the bill document
    const newBill = await Bill.create({ userId,campaignId, strategyId, successPaymentId });
    await openPage(userId,campaignId,strategyId);
    if(newBill){
      return res.status(201).json(newBill);
    } else {
      return res.status(400).json({error: `Error at Request`});
    }

   
  } catch (error) {
    console.error('Error creating bill:', error);
    return res.status(400).json({ message: error.message });
  }
};