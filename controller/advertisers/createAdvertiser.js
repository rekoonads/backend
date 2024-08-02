import Advertisermodel  from "../../models/Advertiser.js";

export default async (req, res) => {
  try {
    const {
      advertiserName,
      createdBy
    } = req.body;

    const new_advertiser = new Advertisermodel({
      advertiserName,
      createdBy
    });
    await Advertisermodel.create(new_advertiser).then((advertiser) => {
        return res.status(201).json(advertiser);
    });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
