/**
 * Comprehensive Chat Test Script
 * 
 * This script tests chat functionality between all role combinations:
 * - Boss, HOD, Team Leader, BD
 * 
 * Features:
 * - Fresh token generation for all roles
 * - Chat creation between different role combinations
 * - Bidirectional messaging test
 * - Message retrieval and verification
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'https://bcrm.100acress.com';
const API_BASE = `${BASE_URL}/api`;

// User credentials - Update these with actual test credentials
const USERS = {
  boss: {
    email: 'info@100acress.com',
    password: 'boss123',
    userId: null, // Will be fetched from login response
    role: 'boss',
    token: null
  },
  hod: {
    email: 'anurag@100acress.com',
    password: 'Anurag100acress',
    userId: null,
    role: 'hod',
    token: null
  },
 
  bd: {
    email: 'booktech2357@gmail.com',
    password: '@Engineering123',
    userId: null,
    role: 'bd',
    token: null
  }
};

// Test lead ID - Use an existing lead from database or create one
let TEST_LEAD_ID = null;

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + (urlObj.search || ''),
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    // Handle HTTPS certificate validation (set rejectUnauthorized to false for self-signed certs if needed)
    if (isHttps) {
      requestOptions.rejectUnauthorized = true;
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers, parseError: e.message });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Function to login and get fresh token
async function loginUser(userKey) {
  const user = USERS[userKey];
  console.log(`\n🔐 Logging in ${user.role} (${user.email})...`);

  try {
    const response = await makeRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: {
        email: user.email,
        password: user.password
      }
    });

    // Login endpoint returns { token, user } on success (status 200)
    // Or { message } on error (status 401/404/403/500)
    if (response.status === 200 && response.data.token) {
      user.token = response.data.token;
      user.userId = response.data.user?._id || response.data.user?._id || response.data.userId;
      
      console.log(`✅ ${user.role} login successful!`);
      console.log(`   User ID: ${user.userId}`);
      console.log(`   Name: ${response.data.user?.name || 'N/A'}`);
      console.log(`   Role: ${response.data.user?.role || 'N/A'}`);
      console.log(`   Token: ${user.token ? user.token.substring(0, 20) + '...' : 'N/A'}`);
      return true;
    } else {
      const errorMessage = response.data.message || response.data.error || 'Unknown error';
      console.log(`❌ ${user.role} login failed:`, errorMessage);
      if (response.status === 404) {
        console.log(`   → User not found. Please check email: ${user.email}`);
      } else if (response.status === 401) {
        console.log(`   → Invalid password for: ${user.email}`);
      } else if (response.status === 403) {
        console.log(`   → Account inactive or access denied for: ${user.email}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ ${user.role} login error:`, error.message);
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log(`   → Network error. Please check if API is accessible at: ${BASE_URL}`);
    }
    return false;
  }
}

// Function to get a test lead (first available lead)
async function getTestLead(token) {
  console.log('\n📋 Getting test lead...');
  
  try {
    const response = await makeRequest(`${API_BASE}/leads`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.success && response.data.data && response.data.data.length > 0) {
      const lead = response.data.data[0];
      TEST_LEAD_ID = lead._id;
      console.log(`✅ Test lead found: ${lead.name || 'Lead'} (ID: ${TEST_LEAD_ID})`);
      return TEST_LEAD_ID;
    } else {
      console.log(`⚠️  No leads found. You may need to create a test lead first.`);
      console.log(`   Using placeholder lead ID for chat creation tests...`);
      // Use a placeholder - chat creation will fail if lead doesn't exist, which is fine for testing
      TEST_LEAD_ID = '000000000000000000000000'; // Placeholder
      return null;
    }
  } catch (error) {
    console.log(`❌ Error getting test lead:`, error.message);
    TEST_LEAD_ID = '000000000000000000000000'; // Placeholder
    return null;
  }
}

// Function to create or get chat
async function createOrGetChat(fromUserKey, toUserKey) {
  const fromUser = USERS[fromUserKey];
  const toUser = USERS[toUserKey];

  if (!fromUser.token || !toUser.userId || !TEST_LEAD_ID) {
    console.log(`⚠️  Cannot create chat: Missing token, userId, or leadId`);
    return null;
  }

  console.log(`\n💬 Creating chat: ${fromUser.role} → ${toUser.role}...`);

  try {
    const response = await makeRequest(`${API_BASE}/chats/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fromUser.token}`
      },
      body: {
        leadId: TEST_LEAD_ID,
        createdBy: fromUser.userId,
        assignedTo: toUser.userId
      }
    });

    if (response.status === 200 && response.data.success) {
      const chatId = response.data.data._id;
      console.log(`✅ Chat created/found: ${chatId}`);
      console.log(`   Participants: ${fromUser.role} ↔ ${toUser.role}`);
      return chatId;
    } else {
      console.log(`❌ Chat creation failed:`, response.data.message || 'Unknown error');
      if (response.data.debug) {
        console.log(`   Debug info:`, JSON.stringify(response.data.debug, null, 2));
      }
      return null;
    }
  } catch (error) {
    console.log(`❌ Chat creation error:`, error.message);
    return null;
  }
}

// Function to send message
async function sendMessage(userKey, chatId, message) {
  const user = USERS[userKey];

  if (!user.token || !chatId) {
    console.log(`⚠️  Cannot send message: Missing token or chatId`);
    return false;
  }

  console.log(`\n📤 Sending message from ${user.role}...`);

  try {
    const response = await makeRequest(`${API_BASE}/chats/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      body: {
        chatId: chatId,
        message: message,
        senderId: user.userId
      }
    });

    if (response.status === 201 && response.data.success) {
      console.log(`✅ Message sent: "${message}"`);
      return true;
    } else {
      console.log(`❌ Message send failed:`, response.data.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log(`❌ Message send error:`, error.message);
    return false;
  }
}

// Function to get chat messages
async function getChatMessages(userKey, chatId) {
  const user = USERS[userKey];

  if (!user.token || !chatId) {
    console.log(`⚠️  Cannot get messages: Missing token or chatId`);
    return [];
  }

  console.log(`\n📥 Getting messages for ${user.role}...`);

  try {
    const response = await makeRequest(`${API_BASE}/chats/messages?chatId=${chatId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      const messages = response.data.data || [];
      console.log(`✅ Retrieved ${messages.length} messages`);
      messages.forEach((msg, index) => {
        const senderName = msg.senderId?.name || 'Unknown';
        const isMe = String(msg.senderId?._id || msg.senderId) === String(user.userId);
        console.log(`   ${index + 1}. [${isMe ? 'You' : senderName}]: ${msg.message}`);
      });
      return messages;
    } else {
      console.log(`❌ Get messages failed:`, response.data.message || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.log(`❌ Get messages error:`, error.message);
    return [];
  }
}

// Function to get all user chats
async function getUserChats(userKey) {
  const user = USERS[userKey];

  if (!user.token) {
    console.log(`⚠️  Cannot get chats: Missing token`);
    return [];
  }

  console.log(`\n📋 Getting all chats for ${user.role}...`);

  try {
    const response = await makeRequest(`${API_BASE}/chats/user-chats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      const chats = response.data.data || [];
      console.log(`✅ Found ${chats.length} chats`);
      chats.forEach((chat, index) => {
        const oppositeUser = chat.oppositeUser?.name || 'Unknown';
        const lastMessage = chat.lastMessage?.message || 'No messages';
        console.log(`   ${index + 1}. Chat with ${oppositeUser}: "${lastMessage}"`);
      });
      return chats;
    } else {
      console.log(`❌ Get chats failed:`, response.data.message || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.log(`❌ Get chats error:`, error.message);
    return [];
  }
}

// Main test function
async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 COMPREHENSIVE CHAT TEST - ROLE-BASED PERMISSIONS');
  console.log('='.repeat(60));

  // Step 1: Login all users
  console.log('\n📝 STEP 1: Logging in all users...');
  const loginResults = {};
  const loggedInUsers = [];
  
  for (const userKey of Object.keys(USERS)) {
    loginResults[userKey] = await loginUser(userKey);
    if (loginResults[userKey]) {
      loggedInUsers.push(userKey);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Check if at least 2 users logged in (minimum required for chat testing)
  if (loggedInUsers.length < 2) {
    console.log('\n❌ At least 2 users must login successfully to test chat functionality.');
    console.log(`   Successfully logged in: ${loggedInUsers.length} user(s) - ${loggedInUsers.join(', ')}`);
    console.log('   Please check credentials or user accounts in database.');
    return;
  }

  console.log(`\n✅ Successfully logged in ${loggedInUsers.length} user(s): ${loggedInUsers.join(', ')}`);
  console.log('   Proceeding with available users for testing...');

  // Step 2: Get test lead
  console.log('\n📝 STEP 2: Getting test lead...');
  await getTestLead(USERS.boss.token);

  // Step 3: Test chat creation for different role combinations (only with logged in users)
  console.log('\n📝 STEP 3: Testing chat creation between available role combinations...');
  
  // Build chat tests dynamically based on logged in users
  const chatTests = [];
  
  // Generate all possible combinations between logged in users
  for (let i = 0; i < loggedInUsers.length; i++) {
    for (let j = 0; j < loggedInUsers.length; j++) {
      if (i !== j) {
        const fromUser = loggedInUsers[i];
        const toUser = loggedInUsers[j];
        const fromRole = USERS[fromUser].role;
        const toRole = USERS[toUser].role;
        chatTests.push({
          from: fromUser,
          to: toUser,
          message: `Hello ${toRole.charAt(0).toUpperCase() + toRole.slice(1)} from ${fromRole.charAt(0).toUpperCase() + fromRole.slice(1)}!`
        });
      }
    }
  }
  
  console.log(`   Testing ${chatTests.length} chat combinations...`);

  const chatResults = {};
  
  for (const test of chatTests) {
    const chatId = await createOrGetChat(test.from, test.to);
    if (chatId) {
      const key = `${test.from}-${test.to}`;
      chatResults[key] = { chatId, from: test.from, to: test.to };
      
      // Send initial message
      await sendMessage(test.from, chatId, test.message);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 4: Test bidirectional messaging (using first available chat)
  console.log('\n📝 STEP 4: Testing bidirectional messaging...');
  
  // Get first available chat for bidirectional testing
  const firstChatKey = Object.keys(chatResults)[0];
  if (firstChatKey && chatResults[firstChatKey]?.chatId) {
    const firstChat = chatResults[firstChatKey];
    const fromUser = firstChat.from;
    const toUser = firstChat.to;
    const chatId = firstChat.chatId;
    
    console.log(`\n🔄 Testing bidirectional: ${USERS[fromUser].role} ↔ ${USERS[toUser].role}`);
    await sendMessage(fromUser, chatId, `${USERS[fromUser].role} message 1`);
    await new Promise(resolve => setTimeout(resolve, 300));
    await sendMessage(toUser, chatId, `${USERS[toUser].role} reply 1`);
    await new Promise(resolve => setTimeout(resolve, 300));
    await sendMessage(fromUser, chatId, `${USERS[fromUser].role} message 2`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verify messages from both sides
    await getChatMessages(fromUser, chatId);
    await new Promise(resolve => setTimeout(resolve, 300));
    await getChatMessages(toUser, chatId);
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    console.log('⚠️  No chats available for bidirectional testing.');
  }

  // Step 5: Get all chats for each logged in user
  console.log('\n📝 STEP 5: Getting all chats for each logged in user...');
  
  for (const userKey of loggedInUsers) {
    await getUserChats(userKey);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const successfulChats = Object.keys(chatResults).length;
  console.log(`✅ Users logged in: ${loggedInUsers.length} (${loggedInUsers.map(u => USERS[u].role).join(', ')})`);
  console.log(`✅ Successful chat creations: ${successfulChats}/${chatTests.length}`);
  console.log(`✅ Role combinations tested: ${loggedInUsers.length > 0 ? loggedInUsers.map(u => USERS[u].role).join(' ↔ ') : 'None'}`);
  console.log(`✅ Bidirectional messaging: ${successfulChats > 0 ? 'Tested' : 'Skipped (no chats)'}`);
  console.log(`✅ Message retrieval: ${successfulChats > 0 ? 'Tested' : 'Skipped (no chats)'}`);
  console.log(`✅ User chats listing: Tested for ${loggedInUsers.length} user(s)`);
  
  if (successfulChats > 0) {
    console.log('\n📋 Chat Combinations Tested:');
    Object.keys(chatResults).forEach(key => {
      const chat = chatResults[key];
      console.log(`   ${USERS[chat.from].role} ↔ ${USERS[chat.to].role} (Chat ID: ${chat.chatId.substring(0, 10)}...)`);
    });
  }
  
  if (loggedInUsers.length < Object.keys(USERS).length) {
    const failedUsers = Object.keys(USERS).filter(u => !loggedInUsers.includes(u));
    console.log(`\n⚠️  Users that failed to login: ${failedUsers.map(u => USERS[u].role).join(', ')}`);
    console.log('   These users were excluded from testing.');
  }
  
  console.log('\n✅ All tests completed!');
  console.log('='.repeat(60));
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test execution failed:', error);
  process.exit(1);
});

