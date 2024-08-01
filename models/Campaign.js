import { model, Schema } from 'mongoose';
const campaignSchema = new Schema(
  {
    campaignId: { type: String, required: true, unique: true },
    campaignName: { type: String, required: true },
    campaignGoal: { type: String, required: true },
    campaignAdvertiserBudget: { type: Number, required: true },
    campaignWeeklyBudget: { type: String },
    campaignDailyBudget: { type: String },
    campaignBudget: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  },
);
const Campaignmodel = model('Campaigns', campaignSchema);

module.exports = Campaignmodel;
