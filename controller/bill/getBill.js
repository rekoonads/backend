import Payment from "../../models/Bill.js";

export default async (req, res) => {
    const campaignId = req.params.campaignId; 
    try {
        const bill = await Payment.findOne({campaignId: campaignId});
        if(bill){
            return res.status(200).json({bill, paymentSuccess: true})
        } else {
            return res.status(400).json({error: ` Error at Request`, paymentSuccess: false})
        }
    } catch (error) {
        return res.status(500).json({error: `Internal Server Error`, paymentSuccess: false})
    }
}