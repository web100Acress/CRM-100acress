const mongoose = require('mongoose');

const whatsappMessageSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  phoneNumber: { type: String, required: true },

  status: { type: String, enum: ['queued', 'sent', 'delivered', 'read', 'failed'], default: 'queued' },
  provider: { type: String, enum: ['stub', 'twilio', 'meta'], default: 'stub' },
  providerMessageId: { type: String },

  body: { type: String, default: '' },
  mediaUrls: { type: [String], default: [] },

  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { minimize: false });

whatsappMessageSchema.index({ leadId: 1, createdAt: -1 });
whatsappMessageSchema.index({ phoneNumber: 1, createdAt: -1 });
whatsappMessageSchema.index({ provider: 1, providerMessageId: 1 }, { unique: true, sparse: true });

whatsappMessageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('WhatsAppMessage', whatsappMessageSchema);
