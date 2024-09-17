import { connectSecondDB } from "../db/mongoConnection.js";
import mongoose, { Schema } from 'mongoose';

// Define the payment schema
const affiliateSchema = new Schema(
  {
   redirectLink :{ type :String,required:true},
   generatedVal :{ type : String,required:true},
   impression :{ type :Number,default:0}
  },
  {
    timestamps: true,
  }
);
const conn = await connectSecondDB();

const Affiliate = conn.model('affiliate', affiliateSchema);

export default Affiliate;

