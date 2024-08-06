import Advertisermodel  from "../../models/Advertiser.js";
import {v4 as uuidv4} from 'uuid';

export default async (req, res) => {
  try {
   

    const new_advertiser = new Advertisermodel({
        advertiserId: req.body.advertiserId,
        advertiserName: req.body.advertiserName,
        createdBy: req.body.createdBy
    });
    await Advertisermodel.create(new_advertiser).then((advertiser) => {
        return res.status(201).json(advertiser);
    });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
