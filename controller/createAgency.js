import { Agencymodel } from '../models/Agencies.js';
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
            agencyName: name
        });

        console.log(id + "  id " + name + "  name " + object);
        console.log(new_agency);

        await userModel.updateOne(
            { userId: created_by },
            { $set: { userType: object } }
        );

        const agency = await Agencymodel.create(new_agency);
        const response_data = [{ agency_data: agency }];

        return res.status(201).json(response_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
