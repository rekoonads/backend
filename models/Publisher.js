import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
  publisherId: { type: String, required: true, unique: true },
  publisherName: { type: String, required: true },
  email: { type: String, required: true },
  createdBy: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

const Publisher = mongoose.model("Publisher", publisherSchema);

export default Publisher;
