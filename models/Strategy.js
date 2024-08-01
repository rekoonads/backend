import {model, Schema} from 'mongoose'; 


const strategySchema = new Schema({
    strategyId: { type: String, required: true, unique: true },
    strategyName: { type: String, required: true },
    strategyDailyBudget: { type: String, required: true },
    ageRange: { type: String, required: true },
    gender: { type: String },
    screens: { type: String, required: true },
    audiences: [{ type: Schema.Types.ObjectId, ref: 'Audiences' }],
    deliveryTimeSlots: { type: String, required: true },
    creatives: { type: String }
}, {
    timestamps: true
});

export const Strategy = model('Strategies', strategySchema)

