// paymentModel.js
import mongoose, { Schema } from "mongoose";

// Define the payment schema
const billSchema = new Schema(
  {
    userId: {
      type: String,
    },
    campaignId: {
      type: String,
    },
    strategyId: {
      type: String,
    },
    successPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("bills", billSchema);

export default Payment;
