const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema({
  CALLING_ENABLED: { type: Boolean, default: false },
  RECORDING_ENABLED: { type: Boolean, default: false },
  MISSED_CALL_LEADS: { type: Boolean, default: false },
  WHATSAPP_AUTOMATION: { type: Boolean, default: false },
  EMAIL_TRACKING: { type: Boolean, default: false },

  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

featureFlagSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
