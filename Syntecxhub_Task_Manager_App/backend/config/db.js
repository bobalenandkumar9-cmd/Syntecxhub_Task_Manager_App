const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Exits the process if the connection fails, since the API is useless without a database.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined. Copy .env.example to .env and set it.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
