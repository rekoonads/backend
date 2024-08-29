import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema({
  errorId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  campaignId: {
    type: String,
    required: false,
  },
  strategyId: {
    type: String,
    required: false,
  },
  errorMessage: {
    type: String,
    required: true,
  }
},{ timestamps: true });

const ErrorModel = mongoose.model('Error', errorSchema);

export default ErrorModel;
