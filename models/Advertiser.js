import { model, Schema } from "mongoose";
const advertiser = new Schema(
  {
    advertiserId: { type: String },
    advertiserName: { type: String },
    createdBy: { type: String },
    advertiserLogo: { type: String },
    gstNumber: { type: String },
    legalName: { type: String },
    address: { type: String },
    gstCertificate: { type: String },
    cinNumber: { type: String },
  },
  {
    timestamps: true,
  }
);
export default model("Advertisers", advertiser);
