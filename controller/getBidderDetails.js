import Bidder from "../models/bidder.js";
import { PriorityQ } from "../PriorityQ/pq.js";

const biding = new PriorityQ()


export default async(req, res) => {

 try {
    const bidData = await Bidder.find(); 
    
    console.log(bidData)
    for await ( let item of bidData){
        console.log(item);
        const bidId = item.agencyId || item.advertiserId
        biding.enqueue(item.campaignBudget, bidId, item.reviveUrl )
    }
    biding.print()
 } catch (error) {
    return res.status(500).json({error: 'Internal Server Error'})
 }   

}