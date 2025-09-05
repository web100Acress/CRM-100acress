// Test script to verify backend setup
const path = require('path');
const dotenv = require('dotenv');

// Load .env file explicitly
const envPath = path.join(__dirname, '.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
}

console.log('=== Backend Setup Test ===');
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('SMTP_USER:', process.env.SMTP_USER);

// Test MongoDB connection
const mongoose = require('mongoose');

async function testMongoDB() {
  try {
    console.log('\n=== Testing MongoDB Connection ===');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Make sure MongoDB is running on your system');
    console.log('   You can start MongoDB with: mongod');
  }
}

// Test email configuration
function testEmailConfig() {
  console.log('\n=== Testing Email Configuration ===');
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || process.env.SMTP_USER,
      pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
    },
  });
  
  console.log('✅ Email transporter created');
  console.log('📧 Email user:', process.env.EMAIL_USER || process.env.SMTP_USER);
  console.log('🔑 Email pass configured:', !!(process.env.EMAIL_PASS || process.env.SMTP_PASS));
}

// Run tests
async function runTests() {
  await testMongoDB();
  testEmailConfig();
  
  console.log('\n=== Setup Complete ===');
  console.log('To start the server, run: npm start');
  console.log('To start in development mode: npm run dev');
}

runTests().catch(console.error);
