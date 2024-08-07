// paymentModel.js
import mongoose, { Schema } from 'mongoose';

// Define the payment schema
const billSchema = new Schema(
  {
    userId: { 
      type: String, 
      
    },
    campaignId: { 
      type: Schema.Types.ObjectId, 
      ref: 'campaigns',  
    },
    strategyId: { 
      type: Schema.Types.ObjectId, 
      ref: 'strategies', 
    
    },
    successPaymentId: { 
      type: String,  
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('bills', billSchema);

export default Payment;

