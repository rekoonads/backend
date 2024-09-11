import { Router } from "express";
import advertiserCreation from "../controller/advertisers/advertiserCreation.js";
import createAgency from "../controller/createAgency.js";
import userCreate from "../controller/userCreate.js";
import campaignGet from "../controller/campaign/campaignGet.js";
import createCampaign from "../controller/campaign/createCampaign.js";
import campaignUpdate from "../controller/campaign/campaignUpdate.js";
import getAdvertiser from "../controller/advertisers/getAdvertiser.js";
import updateAdvertisers from "../controller/advertisers/updateAdvertisers.js";
import deleteAdvertisers from "../controller/advertisers/deleteAdvertisers.js";
import deleteCampaign from "../controller/campaign/deleteCampaign.js";
import getStrategy from "../controller/strategy/getStrategy.js";
import updateStrategy from "../controller/strategy/updateStrategy.js";
import deleteStrategy from "../controller/strategy/deleteStrategy.js";
import createStrategy from "../controller/strategy/createStrategy.js";
import createAdvertiser from "../controller/advertisers/createAdvertiser.js";
import searchUser from "../controller/searchUser.js";
import updateAgency from "../controller/agency/updateAgency.js";
import getAgency from "../controller/agency/getAgency.js";
import update_details from "../controller/update_details.js";
import addBIll from "../controller/bill/addBIll.js";
import addWebsite from "../controller/addWebsite.js";
import campaignAgency from "../controller/campaign/campaignAgency.js";
import getStrategyByCampaignId from "../controller/strategy/getStrategyByCampaignId.js";
import getBill from "../controller/bill/getBill.js";
import uploadFile from "../controller/cloudinery/uploadFile.js";
import updateBalance from "../controller/updateBalance.js";
import vmap from '../controller/vmap.js'
import addBidder from "../controller/addBidder.js";
import getBidderDetails from "../controller/getBidderDetails.js";
import getAdd from "../controller/getAdd.js";
import getVideo from "../controller/getVideo.js";
import saveError from "../controller/saveError.js";
import searchCampaign from "../controller/campaign/searchCampaign.js";
import searchStrategy from "../controller/strategy/searchStrategy.js";
import campaignAdvertiser from "../controller/campaign/campaignAdvertiser.js";
import getCampaignscount from "../controller/campaign/getCampaignscount.js";
import getAllCampaignForAdmin from "../controller/getAllCampaignForAdmin.js";
import editCampaign from "../controller/campaign/editCampaign.js";


const router = Router();
//Agency
router.post("/api/addAgency", createAgency);
router.post("/api/addUser", userCreate);
router.post("/api/webhook/user-created", userCreate);
router.post("/api/webhook/organization-created", createAgency);

//Campaign
router
  .route("/api/campaigns/:userId")
  .get(campaignGet)
  .patch(campaignUpdate);
router.post("/api/campaigns", createCampaign); 
router.get("/api/campaigns-agency/:agencyId", campaignAgency)
router.get("/api/campaigns-advertiser/:advertiserId", campaignAdvertiser);
router.post("/api/edit-campaign",editCampaign);
router.delete('/api/delete-campaign',deleteCampaign)

//For Admin Control
router.get("/api/get-all-campaigns", getAllCampaignForAdmin)


//Strategy
router
  .route("/api/strategy/:userId")
  .get(getStrategy)
  .patch(updateStrategy)
  .delete(deleteStrategy);
router.post("/api/strategy", createStrategy);

//getting the strategy by campaignId 
router.get('/api/strategy-campaign/:campaignId', getStrategyByCampaignId)


//Advertisers
router.post("/api/add-advertiser", createAdvertiser);
router.post("/api/advertisers", advertiserCreation);
router
  .route("/api/advertisers/:userId")
  .get(getAdvertiser)
  .patch(updateAdvertisers)
  .delete(deleteAdvertisers);

  
//Search users
router.get("/api/search-user/:user_id", searchUser);
router.post("/api/update-agency/:agency_id", updateAgency);
router.get("/api/search-agency/:agency_id", getAgency);
router.patch("/api/update_user",update_details)

//Payment 
router.post("/api/bill", addBIll)
router.get('/api/bill/:campaignId', getBill)
router.post("/api/add-website", addWebsite);

//Cloudinery File Uploads
router.post('/api/file-cloud', uploadFile)
router.patch('/api/update-balance', updateBalance)
router.post('/api/add-bidder',addBidder);
router.get('/api/get-bidder-details', getBidderDetails)
router.get('/api/get-ads',getAdd)
router.get('/api/get-video',getVideo)
router.post('/api/save-error',saveError)
router.get('/api/get-campaign',searchCampaign)

router.get('/api/get-strategy',searchStrategy)
router.get('/api/campaign-data',getCampaignscount)
//vmap 
router.get('/api/vmap', vmap)



export default router;
