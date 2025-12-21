const fs = require('fs');
const path = require('path');

const TOKENS_FILE = path.join(__dirname, '../data/uploadTokens.json');

try {
  if (fs.existsSync(TOKENS_FILE)) {
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    const tokens = JSON.parse(data);
    console.log('Current stored tokens:');
    console.log('Number of tokens:', tokens.length);
    tokens.forEach(([token, info]) => {
      console.log(`Token: ${token.substring(0, 20)}...`);
      console.log(`Candidate: ${info.candidateName}`);
      console.log(`Expires: ${info.expiresAt}`);
      console.log('---');
    });
  } else {
    console.log('No tokens file exists');
  }
} catch (error) {
  console.error('Error reading tokens:', error);
}
