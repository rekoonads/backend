import {Advertisermodel} from '../models/Advertiser.js';

export default async (req, res) => {
    try {
        const {
            advertiserName,
            advertiserLogo,
            gstNumber,
            legalName,
            address,
            gstCertificate,
            cinNumber
          } = req.body;
        
          const new_advertiser =  new Advertisermodel({
            advertiserName,
            advertiserLogo,
            gstNumber,
            legalName,
            address,
            gstCertificate,
            cinNumber
          });
          let response_data =[];
          Advertisermodel.create(new_advertiser).then((advertiser) => {
             response_data.push({advertiser_data: advertiser});
          });
          return res.status(201).json(response_data);
    } catch (error) {
        return res.status(401).json({error: error})
    }
  }