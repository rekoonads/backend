import {Agencymodel} from '../models/Agencies.js';
import {userModel} from '../models/User.js';

export default async (req, res) => {
    try {
        const {
            id,
            name,
            created_by,
            object
          } = req.body.data;
        
          const new_agency =  new Agencymodel({
            agencyId : id,
            agencyName: name
          });
          console.log(id+"  id " + name+"  name "+object);
          console.log(new_agency);

          userModel.updateOne(
              { userId: created_by },
              { $set: { userType: object } }
          );
          let response_data =[];
          Agencymodel.create(new_agency).then((agency) => {
             response_data.push({agency_data: agency});
          });
          return res.status(201).json(response_data);
    } catch (error) {
        return res.status(401).json({error: error})
    }
  }