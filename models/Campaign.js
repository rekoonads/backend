import { model, Schema } from "mongoose";

const campaignSchema = new Schema(
  {
    userId: { type: String, required: true },
    campaignId: { type: String, required: true, unique: true },
    agencyId: { type: String },
    advertiserId: { type: String },
    campaignName: { type: String, required: true },
    campaignGoal: { type: String },
    audienceLocation: { type: String },
    website: {
      websiteUrl: { type: String },
      websiteName: { type: String },
      websiteEmail: { type: String },
      websiteContact: { type: String },
    },
    campaignAdvertiserBudget: { type: String, required: true },
    campaignBudget: { type: String, required: true },
    campaignType: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "active", "expired", "paused"],
      default: "scheduled",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Update status method
campaignSchema.methods.updateStatus = function () {
  const now = new Date();
  if (now < this.startDate) {
    this.status = "scheduled";
  } else if (now > this.endDate) {
    this.status = "expired";
  } else {
    this.status = "active";
  }
  return this.save();
};

const Campaignmodel = model("campaigns", campaignSchema);
export default Campaignmodel;
