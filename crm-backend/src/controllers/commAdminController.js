const ProviderAccount = require('../models/providerAccountModel');
const { getFeatureFlags, setFeatureFlags } = require('../services/featureFlagService');

exports.getFeatureFlags = async (req, res, next) => {
  try {
    const flags = await getFeatureFlags();
    return res.json({ success: true, data: flags });
  } catch (err) {
    next(err);
  }
};

exports.updateFeatureFlags = async (req, res, next) => {
  try {
    const allowedKeys = [
      'CALLING_ENABLED',
      'RECORDING_ENABLED',
      'MISSED_CALL_LEADS',
      'WHATSAPP_AUTOMATION',
      'EMAIL_TRACKING',
    ];

    const patch = {};
    for (const k of allowedKeys) {
      if (typeof req.body?.[k] === 'boolean') {
        patch[k] = req.body[k];
      }
    }

    const flags = await setFeatureFlags(patch, req.user?._id);
    return res.json({ success: true, data: flags });
  } catch (err) {
    next(err);
  }
};

exports.listProviders = async (req, res, next) => {
  try {
    const providers = await ProviderAccount.find({}).sort({ providerName: 1 });
    return res.json({ success: true, data: providers });
  } catch (err) {
    next(err);
  }
};

exports.upsertProvider = async (req, res, next) => {
  try {
    const { providerName, isActive, defaultFromNumber, credentials } = req.body || {};

    if (!providerName) {
      return res.status(400).json({ success: false, message: 'providerName is required' });
    }

    const existing = await ProviderAccount.findOne({ providerName });

    if (!existing) {
      const created = await ProviderAccount.create({
        providerName,
        isActive: Boolean(isActive),
        defaultFromNumber: defaultFromNumber || '',
        credentials: credentials && typeof credentials === 'object' ? credentials : {},
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
      });

      if (Boolean(isActive)) {
        await ProviderAccount.updateMany(
          { providerName: { $ne: providerName } },
          { $set: { isActive: false, updatedBy: req.user?._id, updatedAt: new Date() } }
        );
      }

      return res.status(201).json({ success: true, data: created });
    }

    if (typeof isActive === 'boolean') existing.isActive = isActive;
    if (typeof defaultFromNumber === 'string') existing.defaultFromNumber = defaultFromNumber;
    if (credentials && typeof credentials === 'object') existing.credentials = credentials;
    existing.updatedBy = req.user?._id;

    await existing.save();

    if (typeof isActive === 'boolean' && isActive) {
      await ProviderAccount.updateMany(
        { providerName: { $ne: providerName } },
        { $set: { isActive: false, updatedBy: req.user?._id, updatedAt: new Date() } }
      );
    }

    return res.json({ success: true, data: existing });
  } catch (err) {
    next(err);
  }
};
