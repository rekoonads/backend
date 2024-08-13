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

    return { success: true, data: user };
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
