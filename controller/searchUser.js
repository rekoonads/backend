import Advertisermodel  from "../models/Advertiser.js";
import { userModel } from "../models/User.js";
import  Agencymodel  from "../models/Agencies.js";

export default async (req, res) => {
    const userId = req.params.user_id;
    try {
        const user = await userModel.findOne({ userId: userId });

        if (!user) {
            return res.status(404).send('User not found');
        }
        let response = {
            type_of_user: user.userType ? 'Agency' : 'Advertiser'
        };
        if (!user.userType) {
            const advertisers = await Advertisermodel.find({ createdBy: userId});
            response.data = advertisers;
        } else {
            const agencies = await Agencymodel.find({ createdBy: userId }); //this part needs to be changed from createdBy to agencyId
            response.data = agencies;
        }
        return res.send(response);
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).send('Internal server error');
    }
};
