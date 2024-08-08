import Strategy from "../../models/Strategy.js";

export default async (req, res) =>{
    const campaignId = req.params.campaignId; 

    try {
        const strategy = await Strategy.findOne({campaignId: campaignId});
        if(strategy){
            return res.status(200).json(strategy)
        } else {
            return res.status(400).json({error: `Error at the request `})
        }
    } catch (error) {
        return res.status(500).json({error: `Internal Server Error`})
    }
}