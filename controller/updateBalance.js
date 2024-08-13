import { userModel } from "../models/User.js";
export default async (req, res) => {
  const {userId, addedBalance} = req.body;
  try {
    const user = await userModel.findOne({ userId: userId });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const newBalance = user.walletBalance + addedBalance;
    user.walletBalance = newBalance;
    await user.save();
    const updateuser =  await userModel.findOne({ userId: userId });
    console.log(updateuser);
    const update_user = await userModel.findOne({ userId: userId });
    return {  message: "Payment Successfully Verified", data: update_user };
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
