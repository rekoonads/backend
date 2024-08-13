import { model, Schema } from 'mongoose';
const user = new Schema(
  {
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    walletBalance: { type: Number },
    userType: { type: String },
    email: { type: String },
    phoneNo: { type: String }
  },
  {
    timestamps: true,
  },
);
export const userModel = model('Users', user);
