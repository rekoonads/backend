import Advertisermodel from "../models/Advertiser.js";
import Agencymodel from "../models/Agencies.js";

export default async (req, res) => {
  console.log(req.body)
  try {
    if (req.body.typeofuser === "Agency") {
      const updateData = {
        agencyName: req.body.agencyName,
        agencyLogo: req.body.logo,
        gstNumber: req.body.gstNumber,
        legalName: req.body.legalName,
        address: req.body.address,
        gstCertificate: req.body.gstCertificate,
        cinNumber: req.body.cinNumber,
      };

      const agencyId = req.body.agencyId;
      const result = await Agencymodel.findOneAndUpdate(
        { agencyId: agencyId },
        updateData,
        { new: true }
      );
      if (result) {
        return res.status(200).json({ message: "Update successful", data: result });
      } else {
       return res.status(404).json({ message: "Agency not found" });
      }
    } else if(req.body.typeofuser === "Advertiser") {
      const updateData = {
        advertiserName: req.body.advertiserName,
        gstNumber: req.body.gstNumber,
        advertiserLogo: req.body.logo,
        legalName: req.body.legalName,
        address: req.body.address,
        gstCertificate: req.body.gstCertificate,
        cinNumber: req.body.cinNumber,
      };
      const advertiserId = req.body.advertiserId;

      const result = await Advertisermodel.findOneAndUpdate(
        { advertiserId: advertiserId },
        updateData,
        { new: true }
      );
      if (result) {
        return res.status(200).json({ message: "Update successful", data: result });
      } else {
        return res.status(404).json({ message: "Advertiser not found" });
      }
    }
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
