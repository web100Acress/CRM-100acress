require('dotenv').config();
const { requestPasswordReset } = require('./src/controllers/userController');

// Mock request and response objects
const mockReq = {
  body: {
    email: 'krishnaupadhyay207@gmail.com'
  }
};

const mockRes = {
  json: (data) => {
    console.log('Response:', JSON.stringify(data, null, 2));
    return {
      status: () => ({
        json: (errorData) => {
          console.error('Error:', JSON.stringify(errorData, null, 2));
          return errorData;
        }
      })
    };
  },
  status: function(code) {
    this.statusCode = code;
    return this;
  }
};

// Test the password reset request
requestPasswordReset(mockReq, mockRes).catch(console.error);
