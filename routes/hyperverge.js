import express from "express";
import axios from "axios";

const router = express.Router();

// Your Hyperverge API credentials
const appId = process.env.HYPERVERGE_APP_ID;
const appKey = process.env.HYPERVERGE_APP_KEY;
const transactionId = "05szuy8uajfo-DEMO"; // Generate or use a static transaction ID

// Route for GSTIN Lookup using Hyperverge API
router.post("/gstin-lookup", async (req, res) => {
  const { gstin } = req.body;

  if (!gstin) {
    return res.status(400).json({ error: "GSTIN is required" });
  }

  try {
    // Make a POST request to Hyperverge API
    const response = await axios.post(
      "https://ind-lookup.hyperverge.co/api/lookup/searchGSTIN",
      { gstin },
      {
        headers: {
          appId: appId,
          appKey: appKey,
          transactionId: transactionId,
          "Content-Type": "application/json",
        },
      }
    );

    // Return Hyperverge response back to the frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error communicating with Hyperverge API:", error);
    res
      .status(500)
      .json({ error: "Failed to communicate with Hyperverge API" });
  }
});

export default router;
