import Campaignmodel from "../../models/Campaign.js";

const today = new Date();
today.setHours(0, 0, 0, 0); 
async function getActiveCampaigns() {
        try {
            // Find all campaigns
            const campaigns = await Campaignmodel.find({});
        
            // Filter campaigns with valid and active endDate
            const activeCampaigns = campaigns.filter((campaign) => {
              // Try to convert endDate to a JavaScript Date object
              const endDate = new Date(campaign.endDate);
        
              // Check if endDate is valid and after or equal to today
              return !isNaN(endDate.getTime()) && endDate >= today;
            });
            console.log("Active campaigns:", activeCampaigns.length);
            return activeCampaigns;
          } catch (err) {
            console.error("Error finding campaigns:", err);
          }
  }
export default async (req, res) => {
  try {
    const allCampaigns = await Campaignmodel.find({});
    console.log("All campaigns:", allCampaigns);

    const today = new Date().toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    let activeCampaigns = await getActiveCampaigns();
    return res.status(201).json({totalCampaign:allCampaigns,activeCampaign:activeCampaigns});
  } catch (err) {
    console.error("Error finding campaign:", err);
    return res.status(400).json({ error: err.message });
  }
};
