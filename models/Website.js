import { model, Schema } from 'mongoose';
const website = new Schema(
  {
    advertiserId: { type: String },
    agencyId: { type: String},
    createdBy : {type: String},
    websiteUrl : {type: String},
    websiteEmail: {type: String},
    websiteContact: {type: String}
  },
  {
    timestamps: true,
  },
);
export const Websitemodel = model('Websites', website);
