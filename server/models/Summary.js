import { model, Schema } from 'mongoose';
const summarySchema = new Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    paymentAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentDate: { type: Date },
  },
  {
    timestamps: true,
  },
);
const Summarymodel = model('Summary', summarySchema);

module.exports = Summarymodel;
