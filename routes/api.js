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


const router = Router();

//Agency
router.post("/addAgency", createAgency);

//User
router.post("/addUser", userCreate);

//Campaign
router.route("/campaigns/:userId").get(campaignGet).patch(campaignUpdate).delete(deleteCampaign)
router.post("/campaigns", createCampaign);


//Strategy
router.route("/strategy/:userId").get(getStrategy).patch(updateStrategy).delete(deleteStrategy)
router.post("/strategy", createStrategy);


//Advertisers
router.post("/advertisers", advertiserCreation);
router.route('/advertisers/:userId').get(getAdvertiser).patch(updateAdvertisers).delete(deleteAdvertisers);


export default router;
