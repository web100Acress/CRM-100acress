const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI is missing');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
