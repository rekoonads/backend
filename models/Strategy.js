import { model, Schema } from "mongoose";

const strategySchema = new Schema(
  {
    userId: {type: String},
    strategyId: { type: String },
    strategyName: { type: String},
    strategyDailyBudget: { type: String},
    selectedGoal:{ type: String },
    selectedOption: {type: String},
    selectedChannels: [{type: String}],
    ageRange: { type: String},
    gender: { type: String },
    screens: { type: String},
    audiences: [{ type: String }],
    deliveryTimeSlots: { type: Object },
    creatives: { type: String },
  },
  {
    timestamps: true,
  }
);

const Strategy = model("Strategies", strategySchema);

export default Strategy;
