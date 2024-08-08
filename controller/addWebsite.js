import  Websitemodel  from "../models/Website";

export default async (req, res) => {
    try {
       const {advertiserId,agencyId,createdBy,websiteContact,websiteUrl,websiteEmail} = req.body||{};
       const newwebsite = new Websitemodel({
        advertiserId,
        agencyId,
        createdBy,
        websiteUrl,
        websiteEmail,
        websiteContact
       });
       const creaetedWebsite = await Websitemodel.create(newwebsite);
       return res.status(201).json(creaetedWebsite);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
