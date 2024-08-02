import { model, Schema } from 'mongoose';
const agencies = new Schema(
  {
    agencyId: { type: String, required: true, unique: true },
    agencyName: { type: String, required: true },
    createdBy : {type: String, require: true},
    gstNumber: { type: String},
    legalName: { type: String },
    address: { type: String},
    gstCertificate: { type: String},
    cinNumber: { type: String },
    advertisers: [{ type: Schema.Types.ObjectId, ref: 'Advertisers' }]
  },
  {
    timestamps: true,
  },
);
export const Agencymodel = model('Agencies', agencies);
