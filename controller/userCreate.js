import {userModel} from '../models/User.js';

export default async (req, res) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            userType,
            email,
            phoneNo
          } = req.body;
        
          const new_user =  new userModel({
            userId,
            firstName,
            lastName,
            userType,
            email,
            phoneNo
          });
          let response_data =[];
          userModel.create(new_user).then((user) => {
             response_data.push({user_data: user});
          });
          return res.status(201).json(response_data);
    } catch (error) {
        return res.status(401).json({error: error})
    }
  }