import Bill from '../../models/Bill.js'; 
import {openPage} from '../../utils/seleniumScript.js';
import ErrorModel from '../../models/ErrorModel.js';
import { v4 as uuidv4 } from 'uuid';


export default async (req, res) => {
    const { userId, campaignId, strategyId, successPaymentId } = req.body;

  try {
    // Create the bill document
    const newBill = await Bill.create({ userId,campaignId, strategyId, successPaymentId });
    let invocation_code = await openPage(userId,campaignId,strategyId);
    let error_Id = `error-1_${uuidv4()}`;
    const newError = new ErrorModel({
      errorId:error_Id,
      userId,
      campaignId,
      strategyId,
      errorMessage:'safe-save',
      status:'Active',
    });
    await newError.save();
    let count =0;
    if(invocation_code.status=="error"){
      const updatedError = await ErrorModel.findOneAndUpdate(
        { errorId: error_Id }, 
        { errorMessage: invocation_code.message}, // Update errorMessage
        { new: true } // Return the updated document
      );
      
       while(invocation_code.status=="error" && count<3){
        invocation_code = await openPage(userId,campaignId,strategyId);
        count++;
      }
    }
   
    if (newBill) {
      await ErrorModel.findOneAndUpdate(
        { errorId: error_Id }, 
        { status: "Inactive"}, // Update errorMessage
        { new: true } // Return the updated document
      );
      return res.status(201).json({ newBill: newBill, invocation_code: invocation_code });
    } else {
        return res.status(400).json({ error: 'Error at Request' });
    }

   
  } catch (error) {
    console.error('Error creating bill:', error);
    return res.status(400).json({ message: error.message });
  }
};
