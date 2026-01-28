const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Lead = require('../src/models/leadModel');
const Message = require('../src/models/message.model');

/**
 * Migration script:
 * - super-admin -> boss
 * - employee -> bd
 *
 * Updates:
 * - users.role
 * - leads.followUps[].role
 * - leads.assignmentChain[].role
 * - messages.senderRole / messages.recipientRole
 */
async function migrateRoles() {
  try {
    console.log('🔄 Starting migration: super-admin → boss, employee → bd');

    await mongoose.connect(
      process.env.MONGODB_URI ||
        process.env.MONGO_URL ||
        'mongodb+srv://officialhundredacress:officialhundredacress@cluster0.arz8gxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );

    const userResult1 = await User.updateMany(
      { role: 'super-admin' },
      { $set: { role: 'boss' } }
    );
    const userResult2 = await User.updateMany(
      { role: 'employee' },
      { $set: { role: 'bd' } }
    );

    console.log(`✅ Users updated super-admin→boss: ${userResult1.modifiedCount}`);
    console.log(`✅ Users updated employee→bd: ${userResult2.modifiedCount}`);

    // Leads: followUps.role
    const leadFollowUpResult1 = await Lead.updateMany(
      { 'followUps.role': 'super-admin' },
      { $set: { 'followUps.$[fu].role': 'boss' } },
      { arrayFilters: [{ 'fu.role': 'super-admin' }] }
    );
    const leadFollowUpResult2 = await Lead.updateMany(
      { 'followUps.role': 'employee' },
      { $set: { 'followUps.$[fu].role': 'bd' } },
      { arrayFilters: [{ 'fu.role': 'employee' }] }
    );

    console.log(`✅ Lead followUps updated super-admin→boss: ${leadFollowUpResult1.modifiedCount}`);
    console.log(`✅ Lead followUps updated employee→bd: ${leadFollowUpResult2.modifiedCount}`);

    // Leads: assignmentChain.role
    const leadChainResult1 = await Lead.updateMany(
      { 'assignmentChain.role': 'super-admin' },
      { $set: { 'assignmentChain.$[ac].role': 'boss' } },
      { arrayFilters: [{ 'ac.role': 'super-admin' }] }
    );
    const leadChainResult2 = await Lead.updateMany(
      { 'assignmentChain.role': 'employee' },
      { $set: { 'assignmentChain.$[ac].role': 'bd' } },
      { arrayFilters: [{ 'ac.role': 'employee' }] }
    );

    console.log(`✅ Lead assignmentChain updated super-admin→boss: ${leadChainResult1.modifiedCount}`);
    console.log(`✅ Lead assignmentChain updated employee→bd: ${leadChainResult2.modifiedCount}`);

    // Messages
    const msgSender1 = await Message.updateMany(
      { senderRole: 'super-admin' },
      { $set: { senderRole: 'boss' } }
    );
    const msgRecipient1 = await Message.updateMany(
      { recipientRole: 'super-admin' },
      { $set: { recipientRole: 'boss' } }
    );
    const msgSender2 = await Message.updateMany(
      { senderRole: 'employee' },
      { $set: { senderRole: 'bd' } }
    );
    const msgRecipient2 = await Message.updateMany(
      { recipientRole: 'employee' },
      { $set: { recipientRole: 'bd' } }
    );

    console.log(`✅ Messages senderRole super-admin→boss: ${msgSender1.modifiedCount}`);
    console.log(`✅ Messages recipientRole super-admin→boss: ${msgRecipient1.modifiedCount}`);
    console.log(`✅ Messages senderRole employee→bd: ${msgSender2.modifiedCount}`);
    console.log(`✅ Messages recipientRole employee→bd: ${msgRecipient2.modifiedCount}`);

    console.log('🎉 Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  migrateRoles();
}

module.exports = { migrateRoles };
