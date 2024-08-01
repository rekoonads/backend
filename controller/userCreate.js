import {userModel} from '../models/User.js';

export default async (req, res) => {

    try {

        const {
            id,
            first_name,
            last_name
          } = req.body.data;
        
          const new_user =  new userModel({
            userId : id,
            firstName :first_name,
            lastName: last_name,
            userType : "",
            email : req.body.data.email_addresses[0].email_address,
            phoneNo : ""
          });
          console.log(new_user);
          let response_data =[];
          
          const user = await userModel.findById(userId);

          if (user) {
              console.log(`User with ID ${userId} already exists.`);
          } else {
            userModel.create(new_user).then((user) => {
              response_data.push({user_data: user});
            });
          }

          console.log(response_data);
          return res.status(201).json(response_data);
    } catch (error) {
        return res.status(401).json({error: error})
    }
  }