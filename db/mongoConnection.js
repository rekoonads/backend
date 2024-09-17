import mongoose from 'mongoose';

export const mongo = () =>
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB:', err);
    });

// Create a separate connection for the second MongoDB
let secondDBConnection;

export const connectSecondDB = async() => {
  if (!secondDBConnection) {
    secondDBConnection = mongoose.createConnection(process.env.MONGO_DB2);
    secondDBConnection.on('connected', () => {
      console.log('Connected to Second MongoDB');
    });

    secondDBConnection.on('error', (err) => {
      console.log('Error connecting to Second MongoDB:', err);
    });
    await new Promise((resolve, reject) => {
      secondDBConnection.once('open', resolve);
      secondDBConnection.once('error', reject);
    });
  }
  return secondDBConnection;
  }
