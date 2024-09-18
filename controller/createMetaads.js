import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import path from "path";

// Function to create campaign
const createCampaign = async (accessToken, adAccountId) => {
  const campaignData = {
    name: "Video Ad Campaign",
    objective: "OUTCOME_ENGAGEMENT",
    status: "PAUSED",
    special_ad_categories: ["HOUSING"],
    access_token: accessToken,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/campaigns`,
      campaignData
    );
    console.log("Created campaign:", response.data);
    return response.data.id;
  } catch (error) {
    console.error(
      "Error creating campaign:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

// Function to create Ad Set
const createAdSet = async (accessToken, adAccountId, campaignId) => {
  const adSetData = {
    name: "Video Ad Set",
    optimization_goal: "VIDEO_VIEWS",
    billing_event: "IMPRESSIONS",
    bid_amount: 1000, // in cents or paise
    campaign_id: campaignId,
    daily_budget: 8500, // Increase to 85.00₹ or higher (e.g., 85.00₹ = 8500 paise)
    targeting: {
      geo_locations: {
        countries: ["IN"], // Targeting India (adjust if needed)
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

// Function to create Ad Creative
const createAdCreative = async (accessToken, adAccountId, videoId, pageId) => {
  const creativeData = {
    name: "Video Ad Creative",
    object_story_spec: {
      page_id: pageId, // Add your Facebook page ID here
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
    console.log("Created ad creative:", response.data);
    return response.data.id; // Return ad creative ID
  } catch (error) {
    console.error(
      "Error creating ad creative:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

// Function to upload video to Meta
const uploadVideoToMeta = async (accessToken, adAccountId, videoUrl) => {
  try {
    const response = await axios.get(videoUrl, { responseType: "stream" });
    const localVideoPath = path.join(
      os.tmpdir(),
      `tempVideo_${Date.now()}.mp4`
    );
    const writer = fs.createWriteStream(localVideoPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Downloaded video:", localVideoPath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(localVideoPath));
    formData.append("access_token", accessToken);

    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${adAccountId}/advideos`,
      formData,
      { headers: formData.getHeaders() }
    );

    console.log("Video uploaded to Meta:", uploadResponse.data);
    return uploadResponse.data.id;
  } catch (error) {
    console.error(
      "Error uploading video to Meta:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

// API handler
export default async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ message: "No video URL provided" });
    }

    console.log("Received video URL:", videoUrl);

    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    const videoId = await uploadVideoToMeta(accessToken, adAccountId, videoUrl);
    if (!videoId) throw new Error("Failed to upload video");

    const campaignId = await createCampaign(accessToken, adAccountId);
    if (!campaignId) throw new Error("Failed to create campaign");

    const adSetId = await createAdSet(accessToken, adAccountId, campaignId);
    if (!adSetId) throw new Error("Failed to create ad set");

    const adCreativeId = await createAdCreative(
      accessToken,
      adAccountId,
      videoId
      
    );
    if (!adCreativeId) throw new Error("Failed to create ad creative");

    res.json({ success: true });
  } catch (error) {
    console.error("Error in request:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
