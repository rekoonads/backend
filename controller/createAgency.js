import {Agencymodel} from '../models/Agencies.js';

export default async (req, res) => {
    try {
        const {
            agencyId,
            agencyName,
            gstNumber,
            legalName,
            address,
            gstCertificate,
            cinNumber,
            advertisers
          } = req.body;
        
          const new_agency =  new Agencymodel({
            agencyId,
            agencyName,
            gstNumber,
            legalName,
            address,
            gstCertificate,
            cinNumber,
            advertisers
          });
          let response_data =[];
          Agencymodel.create(new_agency).then((agency) => {
             response_data.push({agency_data: agency});
          });
          return res.status(201).json(response_data);
    } catch (error) {
        return res.status(401).json({error: error})
    }
  }