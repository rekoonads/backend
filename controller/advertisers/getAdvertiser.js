import Advertisermodel from "../../models/Advertiser.js";

export default async (req, res) => {
  try {
    const userId = req.params.userId;
    const advertiser = await Advertisermodel.findOne({createdBy: userId});
  if (advertiser){
    return res.status(200).json(advertiser)
  }else{
    return res.status(503).json({ message: `No Data Found` })
  }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};