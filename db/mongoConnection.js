import mongoose from "mongoose";
import campaignScheduler from "../services/campaignScheduler.js";

export const mongo = () =>
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("MongoDB connected");
      campaignScheduler.start();
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
    });

// Create a separate connection for the second MongoDB
