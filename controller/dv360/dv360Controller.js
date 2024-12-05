import { google } from "googleapis";
import dotenv from "dotenv";
import Advertiser from "../../models/Advertiser.js";
import Agency from "../../models/Agencies.js";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const dv360 = google.displayvideo({
  version: "v1",
  auth: oauth2Client,
});

// Store tokens in memory (for demonstration purposes)
// In production, you should use a more secure storage method
const tokenStore = new Map();

export const initiateOAuth = (req, res) => {
  const userId = req.query.userId;
  console.log("Initiating OAuth for userId:", userId);
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/display-video",
      "https://www.googleapis.com/auth/doubleclickbidmanager",
      "https://www.googleapis.com/auth/display-video-mediaplanning",
    ],
    prompt: "consent",
    state: userId,
  });
  console.log("Redirecting to Google OAuth URL:", url);
  res.redirect(url);
};

export const handleOAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  console.log("Received OAuth callback. State (userId):", state);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    tokenStore.set(state, tokens);
    console.log("Tokens stored for userId:", state);
    console.log("Scopes granted:", tokens.scope);

    // Redirect to the frontend with the user ID
    const redirectUrl = `${process.env.FRONTEND_URL}/dv360-integration?userId=${state}`;
    console.log("Redirecting to frontend:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication failed");
  }
};

export const getUserData = async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching user data for userId:", userId);
  try {
    const advertiser = await Advertiser.findOne({ createdBy: userId });
    const agency = await Agency.findOne({ createdBy: userId });

    console.log("User data found:", { advertiser, agency });
    res.json({
      advertiserId: advertiser ? advertiser.advertiserId : null,
      agencyId: agency ? agency.agencyId : null,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const publishAd = async (req, res) => {
  try {
    const { userId, advertiserId, agencyId, creativeId, partnerId } = req.body;
    console.log("Publishing ad for userId:", userId);

    const tokens = tokenStore.get(userId);
    if (!tokens) {
      console.log("No tokens found for userId:", userId);
      return res
        .status(401)
        .json({
          error: "Not authenticated. Please complete the OAuth flow first.",
        });
    }

    oauth2Client.setCredentials(tokens);

    const advertiser = await Advertiser.findOne({ advertiserId });
    if (!advertiser) {
      console.log("Advertiser not found for advertiserId:", advertiserId);
      return res.status(404).json({ error: "Advertiser not found" });
    }

    const agency = await Agency.findOne({ agencyId });
    if (!agency) {
      console.log("Agency not found for agencyId:", agencyId);
      return res.status(404).json({ error: "Agency not found" });
    }

    // Use the provided partnerId instead of fetching it
    if (!partnerId) {
      return res.status(400).json({ error: "Partner ID is required" });
    }

    // Create a new DV360 advertiser if it doesn't exist
    let dv360AdvertiserId;
    try {
      const dv360Advertiser = await dv360.advertisers.create({
        requestBody: {
          displayName: advertiser.advertiserName,
          entityStatus: "ENTITY_STATUS_ACTIVE",
          partnerId: partnerId,
        },
      });
      dv360AdvertiserId = dv360Advertiser.data.advertiserId;
      console.log("Created new DV360 advertiser:", dv360AdvertiserId);
    } catch (error) {
      if (error.code === 409) {
        // Advertiser already exists, try to fetch it
        try {
          const existingAdvertisers = await dv360.advertisers.list({
            filter: `displayName="${advertiser.advertiserName}"`,
          });
          dv360AdvertiserId =
            existingAdvertisers.data.advertisers[0].advertiserId;
          console.log("Using existing DV360 advertiser:", dv360AdvertiserId);
        } catch (listError) {
          console.error("Error listing advertisers:", listError);
          return res
            .status(500)
            .json({
              error: "Failed to create or fetch advertiser",
              details: listError.message,
            });
        }
      } else {
        console.error("Error creating advertiser:", error);
        return res
          .status(500)
          .json({
            error: "Failed to create advertiser",
            details: error.message,
          });
      }
    }

    // Create insertion order
    let insertionOrder;
    try {
      insertionOrder = await dv360.advertisers.insertionOrders.create({
        advertiserId: dv360AdvertiserId,
        requestBody: {
          displayName: `IO for ${advertiser.advertiserName}`,
          entityStatus: "ENTITY_STATUS_ACTIVE",
        },
      });
      console.log(
        "Created insertion order:",
        insertionOrder.data.insertionOrderId
      );
    } catch (error) {
      console.error("Error creating insertion order:", error);
      return res
        .status(500)
        .json({
          error: "Failed to create insertion order",
          details: error.message,
        });
    }

    // Create line item
    let lineItem;
    try {
      lineItem = await dv360.advertisers.lineItems.create({
        advertiserId: dv360AdvertiserId,
        requestBody: {
          insertionOrderId: insertionOrder.data.insertionOrderId,
          displayName: "YouTube Ad Campaign",
          lineItemType: "LINE_ITEM_TYPE_DISPLAY_DEFAULT",
          entityStatus: "ENTITY_STATUS_ACTIVE",
        },
      });
      console.log("Created line item:", lineItem.data.lineItemId);
    } catch (error) {
      console.error("Error creating line item:", error);
      return res
        .status(500)
        .json({ error: "Failed to create line item", details: error.message });
    }

    // Associate creative with line item
    try {
      await dv360.advertisers.lineItems.associateCreative({
        advertiserId: dv360AdvertiserId,
        lineItemId: lineItem.data.lineItemId,
        requestBody: {
          creativeId: creativeId,
        },
      });
      console.log("Associated creative with line item");
    } catch (error) {
      console.error("Error associating creative:", error);
      return res
        .status(500)
        .json({
          error: "Failed to associate creative",
          details: error.message,
        });
    }

    res.json({
      message: "Ad published successfully",
      dv360AdvertiserId,
      insertionOrderId: insertionOrder.data.insertionOrderId,
      lineItemId: lineItem.data.lineItemId,
    });
  } catch (error) {
    console.error("Error publishing ad:", error);
    res.status(500).json({
      error: "Failed to publish ad",
      details: error.message,
      scopes: oauth2Client.credentials.scope,
    });
  }
};
