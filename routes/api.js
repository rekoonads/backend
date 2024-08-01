import {Router} from "express";
import advertiserCreation from "../controller/advertiserCreation.js";
import createAgency from "../controller/createAgency.js";
import userCreate from "../controller/userCreate.js";
const router = Router();

router.post("/addAdvertiser", advertiserCreation);
router.post("/addAgency", createAgency);
router.post('/addUser',userCreate)
export default router