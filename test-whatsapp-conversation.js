// Test script for WhatsApp conversation loading
// Run this in browser console when WhatsApp modal is open

// Test 1: Check if recipient data is available
console.log('=== Test 1: Recipient Data ===');
const recipientData = window.recipient || getWhatsAppRecipient();
console.log('Recipient:', recipientData);

// Test 2: Check current user ID
console.log('\n=== Test 2: Current User ID ===');
const token = localStorage.getItem('token');
if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('User ID options:', {
            userId: payload.userId,
            id: payload.id,
            _id: payload._id
        });
    } catch (e) {
        console.error('Error parsing token:', e);
    }
}

// Test 3: Direct API call to fetch conversation
console.log('\n=== Test 3: Direct API Call ===');
async function testConversationAPI() {
    const recipientId = recipientData?._id || recipientData?.id;
    if (!recipientId) {
        console.error('No recipient ID found');
        return;
    }
    
    const testToken = localStorage.getItem('token');
    console.log('Testing with recipient ID:', recipientId);
    
    try {
        const response = await fetch(`https://bcrm.100acress.com/api/messages/conversation/${recipientId}`, {
            headers: {
                'Authorization': `Bearer ${testToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', data);
        
        if (data.success && data.data) {
            console.log(`Found ${data.data.length} messages`);
            data.data.forEach((msg, index) => {
                console.log(`Message ${index + 1}:`, {
                    id: msg._id,
                    senderId: msg.senderId,
                    message: msg.message.substring(0, 50) + '...',
                    timestamp: msg.timestamp,
                    senderName: msg.senderName
                });
            });
        }
    } catch (error) {
        console.error('API Call Error:', error);
    }
}

// Run the test
testConversationAPI();

// Test 4: Check if messages are being set in state
console.log('\n=== Test 4: Check Message State ===');
// Look for React component state (this might not work directly)
console.log('Check if messages appear in the UI after a few seconds...');

// Instructions
console.log('\n=== Manual Test Instructions ===');
console.log('1. Open WhatsApp chat');
console.log('2. Check browser console for logs');
console.log('3. Look for "Fetching conversation" logs');
console.log('4. Check if messages appear in the chat');
console.log('5. Try sending a test message');
