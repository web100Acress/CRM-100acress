const ProviderAccount = require('../models/providerAccountModel');

async function getActiveProvider() {
  const active = await ProviderAccount.findOne({ isActive: true }).lean();
  if (active && active.providerName) {
    return active.providerName;
  }
  return 'stub';
}

module.exports = { getActiveProvider };
