// models/Demographics.js
import mongoose from "mongoose";

const demographicsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    country: String,
    city: String,
    state: String,
  },
  interests: [
    {
      type: String,
    },
  ],
  occupation: {
    type: String,
  },
  education: {
    type: String,
    enum: ["High School", "Bachelor", "Master", "PhD", "Other"],
  },
  income_bracket: {
    type: String,
    enum: ["0-25k", "25k-50k", "50k-75k", "75k-100k", "100k+"],
  },
  marital_status: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update the updated_at field
demographicsSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Demographics = mongoose.model("Demographics", demographicsSchema);

export default Demographics;
