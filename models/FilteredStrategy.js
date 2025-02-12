import mongoose from "mongoose";

const filteredStrategySchema = new mongoose.Schema({
  strategyId: String,
  userId: String,
  demographics: [
    {
      name: String,
      age: Number,
      gender: String,
      email: String,
      location: {
        country: String,
        city: String,
        state: String,
      },
      interests: [String],
      occupation: String,
      education: String,
      income_bracket: String,
      marital_status: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const FilteredStrategy = mongoose.model(
  "FilteredStrategy",
  filteredStrategySchema
);

export default FilteredStrategy;
