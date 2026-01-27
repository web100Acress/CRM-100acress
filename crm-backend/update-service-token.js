#!/usr/bin/env node

/**
 * Script to update SERVICE_TOKEN for production
 * Run this script after getting fresh token from 100acress.com
 */

const fs = require('fs');
const path = require('path');

// Configuration
const envPath = path.join(__dirname, '.env');
const productionEnvPath = path.join(__dirname, '.env.production');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function updateServiceToken(newToken, envFile = envPath) {
  try {
    if (!fs.existsSync(envFile)) {
      log(`❌ Environment file not found: ${envFile}`, colors.red);
      return false;
    }

    let envContent = fs.readFileSync(envFile, 'utf8');
    
    // Check if SERVICE_TOKEN exists
    if (envContent.includes('SERVICE_TOKEN=')) {
      // Replace existing SERVICE_TOKEN
      envContent = envContent.replace(
        /SERVICE_TOKEN=.*/g,
        `SERVICE_TOKEN=${newToken}`
      );
    } else {
      // Add SERVICE_TOKEN if it doesn't exist
      envContent += `\n# 100acress Backend Integration\nSERVICE_TOKEN=${newToken}\n`;
    }

    // Add missing production variables
    if (!envContent.includes('NODE_ENV=')) {
      envContent += '\nNODE_ENV=production\n';
    }
    if (!envContent.includes('FRONTEND_URL=')) {
      envContent += 'FRONTEND_URL=https://bcrm.100acress.com\n';
    }

    fs.writeFileSync(envFile, envContent);
    log(`✅ Updated SERVICE_TOKEN in: ${envFile}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Error updating ${envFile}: ${error.message}`, colors.red);
    return false;
  }
}

function validateToken(token) {
  try {
    // Basic JWT validation (structure check)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Decode payload to check expiry
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      log(`❌ Token expired on: ${new Date(payload.exp * 1000).toLocaleString()}`, colors.red);
      return false;
    }

    log(`✅ Token valid until: ${new Date(payload.exp * 1000).toLocaleString()}`, colors.green);
    log(`📧 Token for: ${payload.email || 'Unknown'}`, colors.blue);
    log(`👤 Role: ${payload.role || 'Unknown'}`, colors.blue);
    
    return true;
  } catch (error) {
    log(`❌ Invalid token format: ${error.message}`, colors.red);
    return false;
  }
}

function main() {
  log('🚀 SERVICE_TOKEN Update Script for Production', colors.blue);
  log('==========================================', colors.blue);

  // Get token from command line argument or prompt
  const newToken = process.argv[2];
  
  if (!newToken) {
    log('\n📋 Instructions:', colors.yellow);
    log('1. Open https://www.100acress.com', colors.yellow);
    log('2. Login as admin (info@100acress.com)', colors.yellow);
    log('3. Open DevTools (F12)', colors.yellow);
    log('4. Go to Application → Local Storage', colors.yellow);
    log('5. Copy the token value', colors.yellow);
    log('6. Run this script with the token:', colors.yellow);
    log('   node update-service-token.js "paste_token_here"', colors.yellow);
    log('\n❌ Please provide the token as argument', colors.red);
    process.exit(1);
  }

  log('\n🔍 Validating new token...', colors.blue);
  
  if (!validateToken(newToken)) {
    log('\n❌ Token validation failed. Please get a fresh token.', colors.red);
    process.exit(1);
  }

  log('\n📝 Updating environment files...', colors.blue);
  
  // Update both .env and .env.production files
  const updatedMain = updateServiceToken(newToken, envPath);
  const updatedProduction = updateServiceToken(newToken, productionEnvPath);

  if (updatedMain || updatedProduction) {
    log('\n✅ SUCCESS! SERVICE_TOKEN updated successfully!', colors.green);
    log('\n🔄 Next steps:', colors.yellow);
    log('1. Restart the CRM backend:', colors.yellow);
    log('   pm2 restart crm-backend', colors.white);
    log('2. Test website enquiries:', colors.yellow);
    log('   https://bcrm.100acress.com', colors.white);
    log('3. Check debug endpoint:', colors.yellow);
    log('   https://bcrm.100acress.com/api/website-enquiries/debug', colors.white);
    log('\n🎯 Expected result:', colors.green);
    log('✅ Desktop: Website enquiries loaded: 3684 enquiries', colors.green);
    log('✅ Desktop: All leads loaded successfully: 3695 total leads', colors.green);
  } else {
    log('\n❌ Failed to update SERVICE_TOKEN', colors.red);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateServiceToken, validateToken };
