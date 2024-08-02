import { Agencymodel } from "../../models/Agencies.js";


export default async (req, res) => {
    const agencyId = req.params.agency_id;
    try {
        const agency = await Agencymodel.findOne({ agencyId: agencyId });

        if (!agency) {
            return res.status(404).send('Agency not found');
        }else {
            return res.status(201).json(agency);
        }
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).send('Internal server error');
    }
};