import mongoose from "mongoose";

const publisherWebsiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, default: "Pending Review" },
    publisherId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PublisherWebsite = mongoose.model(
  "PublisherWebsite",
  publisherWebsiteSchema
);

export default PublisherWebsite;
