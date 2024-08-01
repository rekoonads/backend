import Advertisermodel from "../../models/Advertiser.js";

export default async (req, res) => {
    try {
      const updatedAdvertisement = await Advertisermodel.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
      );
  
      return !updatedAdvertisement
        ? res.status(404).json({ message: "Advertisement details not found" })
        : res.status(200).json(updatedAdvertisement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
