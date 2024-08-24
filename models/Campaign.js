import { model, Schema } from 'mongoose';
const campaignSchema = new Schema(
  {
    userId: { type: String, required: true },
    campaignId: { type: String, required: true, unique: true },
    agencyId: {type: String},
    advertiserId: {type: String},
    campaignName: { type: String, required: true },
    campaignGoal: { type: String },
    website: {
      advertiserId: { type: String },
      agencyId: { type: String},
      createdBy : {type: String},
      websiteUrl : {type: String},
      websiteName:{type: String},
      websiteEmail: {type: String},
      websiteContact: {type: String}
    },
    campaignAdvertiserBudget: { type: String, required: true },
    campaignBudget: { type: String, required: true },
    campaignType: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    
  },
  { timestamps: true }
);
const Campaignmodel = model('campaigns', campaignSchema);

export default Campaignmodel;
