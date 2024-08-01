import mongoose from 'mongoose';

export const mongo = () =>
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log('Mongo db connected');
    })
    .catch((err) => {
      console.log(err);
    });
