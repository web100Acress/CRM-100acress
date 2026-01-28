#!/usr/bin/env node

/**
 * Quick fix to force update PM2 environment variables
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Forcing PM2 environment update...');

// Read the .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && !key.startsWith('#') && values.length > 0) {
    envVars[key.trim()] = values.join('=').trim();
  }
});

console.log('📝 Environment variables found:', Object.keys(envVars));

// Update PM2 environment
Object.entries(envVars).forEach(([key, value]) => {
  const command = `pm2 set crm-backend env:${key}="${value}"`;
  console.log(`🔄 Setting: ${key}`);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error setting ${key}:`, error.message);
    } else {
      console.log(`✅ Set: ${key}`);
    }
  });
});

// Restart PM2 after a delay
setTimeout(() => {
  console.log('🔄 Restarting PM2...');
  exec('pm2 restart crm-backend', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error restarting:', error.message);
    } else {
      console.log('✅ PM2 restarted successfully');
      console.log('🎯 Test: https://bcrm.100acress.com/api/website-enquiries/debug');
    }
  });
}, 2000);
