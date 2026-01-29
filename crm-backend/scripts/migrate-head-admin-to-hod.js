const mongoose = require('mongoose');
const User = require('../src/models/userModel');

/**
 * Migration script: Update all users with role 'head-admin' to 'hod'
 * Run this once to migrate existing users
 */

async function migrateHeadAdminToHOD() {
  try {
    console.log('🔄 Starting migration: head-admin → hod');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb+srv://officialhundredacress:officialhundredacress@cluster0.arz8gxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    
    // Find all users with role 'head-admin'
    const headAdminUsers = await User.find({ role: 'head-admin' });
    console.log(`📊 Found ${headAdminUsers.length} users with 'head-admin' role`);
    
    if (headAdminUsers.length === 0) {
      console.log('✅ No users found with head-admin role. Migration complete.');
      return;
    }
    
    // Update all head-admin users to hod
    const result = await User.updateMany(
      { role: 'head-admin' },
      { role: 'hod' }
    );
    
    console.log(`✅ Successfully updated ${result.modifiedCount} users from 'head-admin' to 'hod'`);
    
    // Verify the migration
    const hodUsers = await User.find({ role: 'hod' });
    console.log(`📊 Total users with 'hod' role after migration: ${hodUsers.length}`);
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateHeadAdminToHOD();
}

module.exports = { migrateHeadAdminToHOD };
