const FeatureFlag = require('../models/featureFlagModel');

async function getFeatureFlags() {
  let flags = await FeatureFlag.findOne({}).sort({ createdAt: -1 });
  if (!flags) {
    flags = await FeatureFlag.create({});
  }
  return flags;
}

async function setFeatureFlags(patch, updatedBy) {
  const flags = await getFeatureFlags();
  Object.assign(flags, patch);
  if (updatedBy) {
    flags.updatedBy = updatedBy;
  }
  await flags.save();
  return flags;
}

module.exports = { getFeatureFlags, setFeatureFlags };
