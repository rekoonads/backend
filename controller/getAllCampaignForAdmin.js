import Campaignmodel from "../models/Campaign.js";

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
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
  async function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (!isValidDate(start) || !isValidDate(end)) {
      console.error(`Invalid date(s) found: startDate=${startDate}, endDate=${endDate}`);
      return 0; // Return 0 if dates are invalid to avoid NaN
    }
    // Calculate difference in milliseconds and convert to days
    const durationInDays = (end - start) / (1000 * 60 * 60 * 24) + 1; // +1 to include both start and end dates
    return durationInDays;
  }
export default async (req, res) => {
  try {
   
    const campaigns = await Campaignmodel.find({});
    const activeCampaigns = await getActiveCampaigns();
    let totalDays = 0;
    let campaignCount = campaigns.length;
    let validCampaigns = 0;

    for (let campaign of campaigns) {
      const { startDate, endDate } = campaign;

      // Normalize date formats if necessary
      const durationInDays = calculateDuration(startDate, endDate);

      if (durationInDays > 0) {
        totalDays += durationInDays; // Sum only valid durations
        validCampaigns++;
      }
    }
    console.log("validate cmp: --",validCampaigns,"total cmp",totalDays);

    // Calculate the average duration
    const averageDuration = totalDays / campaignCount;
    console.log("average duration is: -" ,averageDuration)
    return res.status(200).json({totalCampaign:campaigns,activeCampaign:activeCampaigns,average:averageDuration});
    // return campaigns
    //   ? res.status(200).json(campaigns)
    //   : res.status(503).json({ message: `No Campaigns Created` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
