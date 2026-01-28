const ProviderAccount = require('../models/providerAccountModel');

async function getActiveProvider() {
  const active = await ProviderAccount.findOne({ isActive: true }).lean();
  if (active && active.providerName) {
    return active.providerName;
  }
  return 'stub';
}

async function getActiveProviderAccount() {
  const active = await ProviderAccount.findOne({ isActive: true }).lean();
  if (active && active.providerName) {
    return active;
  }
  return { providerName: 'stub', isActive: true, defaultFromNumber: '', credentials: {} };
}

module.exports = { getActiveProvider, getActiveProviderAccount };
