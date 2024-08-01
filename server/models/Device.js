import { model, Schema } from 'mongoose';

const deviceSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    deviceMacAddress: {
      type: String,
      required: true,
    },
    deviceLocation: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Device = model('Devices', deviceSchema);
