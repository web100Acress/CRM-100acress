const mongoose = require('mongoose');

const callRecordingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['none', 'pending', 'available', 'failed'],
      default: 'none',
    },
    providerRecordingId: { type: String },
    s3Key: { type: String },
    url: { type: String },
    durationSec: { type: Number },
  },
  { _id: false }
);

const callNotesSchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
    tags: { type: [String], default: [] },
    disposition: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const callLogSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },

    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    phoneNumber: { type: String, required: true },
    direction: { type: String, enum: ['inbound', 'outbound'], required: true },
    status: {
      type: String,
      enum: ['queued', 'ringing', 'answered', 'missed', 'failed', 'ended'],
      default: 'queued',
    },

    startTime: { type: Date },
    endTime: { type: Date },
    durationSec: { type: Number, default: 0 },

    provider: { type: String, enum: ['stub', 'twilio', 'exotel', 'knowlarity'], default: 'stub' },
    providerCallId: { type: String },

    recording: { type: callRecordingSchema, default: () => ({}) },
    notes: { type: callNotesSchema, default: () => ({}) },

    meta: {
      type: Object,
      default: {},
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

callLogSchema.index({ createdAt: -1 });
callLogSchema.index({ leadId: 1, createdAt: -1 });
callLogSchema.index({ assignedUserId: 1, createdAt: -1 });
callLogSchema.index({ phoneNumber: 1, createdAt: -1 });
callLogSchema.index({ provider: 1, providerCallId: 1 }, { unique: true, sparse: true });

callLogSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CallLog', callLogSchema);
