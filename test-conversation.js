// Test WhatsApp conversation API
const https = require('https');

// Test function
async function testConversationAPI() {
  console.log('Testing WhatsApp conversation API...');
  
  // You need to replace these with actual values
  const testToken = 'YOUR_BEARER_TOKEN_HERE'; // Get from browser localStorage
  const recipientId = 'RECIPIENT_USER_ID_HERE'; // Get from browser console when WhatsApp opens
  
  if (testToken === 'YOUR_BEARER_TOKEN_HERE' || recipientId === 'RECIPIENT_USER_ID_HERE') {
    console.log('Please update the token and recipientId in this file with actual values');
    console.log('Get token from: localStorage.getItem("token") in browser console');
    console.log('Get recipientId from: window.recipient._id when WhatsApp modal is open');
    return;
  }
  
  const options = {
    hostname: 'bcrm.100acress.com',
    port: 443,
    path: `/api/messages/conversation/${recipientId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(options, (res) => {
    console.log(`API Response Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('API Response Data:', JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success && jsonData.data) {
          console.log(`Found ${jsonData.data.length} messages`);
          jsonData.data.forEach((msg, index) => {
            console.log(`Message ${index + 1}:`, {
              id: msg._id,
              senderId: msg.senderId,
              message: msg.message ? msg.message.substring(0, 50) + '...' : 'No message',
              timestamp: msg.timestamp,
              senderName: msg.senderName
            });
          });
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
        console.log('Raw response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('API Call Error:', error);
  });
  
  req.end();
}

// Run the test
testConversationAPI();
