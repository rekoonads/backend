import {Router} from "express";
import advertiserCreation from "../controller/advertiserCreation.js";
import createAgency from "../controller/createAgency.js";
const router = Router();

router.post("/addAdvertiser", advertiserCreation);
router.post("/addAgency", createAgency);
export default router