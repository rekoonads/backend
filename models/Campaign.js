import { model, Schema } from 'mongoose';
const campaignSchema = new Schema(
  {
    userId: { type: String, required: true },
    campaignId: { type: String, required: true, unique: true },
    campaignName: { type: String, required: true },
    campaignGoal: { type: String },
    campaignAdvertiserBudget: { type: String, required: true },
    campaignBudget: { type: String, required: true },
    campaignType: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: true }
);
const Campaignmodel = model('Campaigns', campaignSchema);

export default Campaignmodel;
