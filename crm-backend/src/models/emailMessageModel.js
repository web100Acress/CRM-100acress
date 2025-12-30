const mongoose = require('mongoose');

const emailMessageSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  to: { type: String, required: true },
  subject: { type: String, required: true },

  provider: { type: String, enum: ['smtp', 'stub'], default: 'smtp' },
  providerMessageId: { type: String },

  status: { type: String, enum: ['queued', 'sent', 'delivered', 'opened', 'clicked', 'failed'], default: 'queued' },

  trackingId: { type: String },
  openedAt: { type: Date },

  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { minimize: false });

emailMessageSchema.index({ leadId: 1, createdAt: -1 });
emailMessageSchema.index({ to: 1, createdAt: -1 });
emailMessageSchema.index({ trackingId: 1 }, { unique: true, sparse: true });

emailMessageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('EmailMessage', emailMessageSchema);
