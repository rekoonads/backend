import  Agencymodel  from "../../models/Agencies.js";

export default async (req, res) => {
    const agencyId = req.params.agency_id;

    const updateData = {
        agencyName: req.body.agencyName,
        createdBy: req.body.createdBy,
        gstNumber: req.body.gstNumber,
        legalName: req.body.legalName,
        address: req.body.address,
        gstCertificate: req.body.gstCertificate,
        cinNumber: req.body.cinNumber,
        advertisers: req.body.advertisers
    };

    try {
        const updatedAgency = await Agencymodel.findOneAndUpdate(
            { agencyId: agencyId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAgency) {
            return res.status(404).send('Agency not found');
        }

        return res.send(updatedAgency);
    } catch (error) {
        console.error('Error updating agency:', error);
        return res.status(500).send('Internal server error');
    }
};
