const mongoose = require('mongoose');

const providerAccountSchema = new mongoose.Schema({
  providerName: {
    type: String,
    enum: ['stub', 'twilio', 'exotel', 'knowlarity'],
    required: true,
  },

  isActive: { type: Boolean, default: false },
  defaultFromNumber: { type: String, default: '' },

  credentials: {
    type: Object,
    default: {},
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

providerAccountSchema.index({ providerName: 1 }, { unique: true });

providerAccountSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ProviderAccount', providerAccountSchema);
