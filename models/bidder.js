// paymentModel.js
import mongoose, { Schema } from 'mongoose';

// Define the payment schema
const bidderSchema = new Schema(
  {
    agencyId: { 
      type: String, 
      
    },
    advertiserId: { 
      type: String, 
    },
    deliveryTimeSlots: { 
        type: Object ,
    },
    campaignBudget: { 
        type: String,   
    },
    reviveUrl : {
        type: String,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status :{
         type: String,
    },
    audiences: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Bidder = mongoose.model('bidder', bidderSchema);

export default Bidder;

