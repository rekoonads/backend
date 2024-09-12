// import Campaignmodel from "../../models/Campaign.js";
import "dotenv/config";
import axios from "axios";
import fs from "fs"; // Node.js file system to read the video file
import FormData from "form-data";

const createCampaign = async (accessToken, adAccountId) => {
  const campaignData = {
    name: "Video Ad Campaign",
    objective: "VIDEO_VIEWS",
    status: "PAUSED",
    access_token: accessToken,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/campaigns`,
      campaignData
    );
    return response.data.id; // Return campaign ID
  } catch (error) {
    console.error(
      "Error creating campaign:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const createAdSet = async (accessToken, adAccountId, campaignId) => {
  const adSetData = {
    name: "Video Ad Set",
    optimization_goal: "VIDEO_VIEWS",
    billing_event: "IMPRESSIONS",
    bid_amount: 1000, // in cents
    campaign_id: campaignId,
    daily_budget: 5000, // in cents
    targeting: {
      geo_locations: {
        countries: ["US"],
      },
    },
    status: "PAUSED",
    access_token: accessToken,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/adsets`,
      adSetData
    );
    return response.data.id; // Return ad set ID
  } catch (error) {
    console.error(
      "Error creating ad set:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const createAdCreative = async (accessToken, adAccountId, videoId) => {
  const creativeData = {
    name: "Video Ad Creative",
    object_story_spec: {
      video_data: {
        video_id: videoId,
        call_to_action: {
          type: "LEARN_MORE",
          value: {
            link: "https://your-website.com", // Your website link
          },
        },
        message: "Check out our latest video!",
      },
    },
    access_token: accessToken,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/adcreatives`,
      creativeData
    );
    return response.data.id; // Return ad creative ID
  } catch (error) {
    console.error(
      "Error creating ad creative:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const createAd = async (accessToken, adAccountId, adSetId, adCreativeId) => {
  const adData = {
    name: "Video Ad",
    adset_id: adSetId,
    creative: {
      creative_id: adCreativeId,
    },
    status: "PAUSED",
    access_token: accessToken,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/ads`,
      adData
    );
    return response.data.id; // Return ad ID
  } catch (error) {
    console.error(
      "Error creating ad:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const uploadVideo = async (accessToken, adAccountId, videoPath) => {
  const formData = new FormData();
  formData.append("source", fs.createReadStream(videoPath)); // Path to video file
  formData.append("access_token", accessToken);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/advideos`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return response.data.id; // Return uploaded video ID
  } catch (error) {
    console.error(
      "Error uploading video:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

export default async (req, res) => {
  try {
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const videoPath = "path/to/your/video.mp4"; // Path to your video file

    // Step 1: Upload video and get video ID
    const videoId = await uploadVideo(accessToken, adAccountId, videoPath);
    if (!videoId) throw new Error("Failed to upload video");

    // Step 2: Create the campaign
    const campaignId = await createCampaign(accessToken, adAccountId);
    if (!campaignId) throw new Error("Failed to create campaign");

    // Step 3: Create the Ad Set
    const adSetId = await createAdSet(accessToken, adAccountId, campaignId);
    if (!adSetId) throw new Error("Failed to create ad set");

    // Step 4: Create the Ad Creative with the uploaded video ID
    const adCreativeId = await createAdCreative(
      accessToken,
      adAccountId,
      videoId
    );
    if (!adCreativeId) throw new Error("Failed to create ad creative");

    // Step 5: Create the Ad
    const adId = await createAd(
      accessToken,
      adAccountId,
      adSetId,
      adCreativeId
    );
    if (!adId) throw new Error("Failed to create ad");

    res.json({ success: true, adId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
