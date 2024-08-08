import  Agencymodel  from '../models/Agencies.js';
import { userModel } from '../models/User.js';

export default async (req, res) => {
    try {
        const {
            id,
            name,
            created_by,
            object
        } = req.body.data || {};
       
        if (!id || !name || !created_by || !object) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const new_agency = new Agencymodel({
            agencyId: id,
            createdBy: created_by,
            agencyName: name
        });
 
        console.log(id + "  id " + name + "  name " + object+"  created "+created_by);
        console.log(new_agency);
        let response_data = [];

        await userModel.updateOne(
            { userId: created_by },
            { $set: { userType: object } }
        );
        const agency_test = await Agencymodel.findOne({ agencyId: id });
        if(agency_test){
            console.log(`agency with ID ${id} already exists.`);
            return res.status(409).json({ error: `Agency with ID ${id} already exists.` });
        }else{
            const agency = await Agencymodel.create(new_agency);
            response_data.push({ agency_data: agency });
        }
       

        return res.status(201).json(response_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
