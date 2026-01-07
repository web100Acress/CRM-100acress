const CallLog = require('../models/callLogModel');
const Lead = require('../models/leadModel');
const { getFeatureFlags } = require('../services/featureFlagService');
const { getActiveProviderAccount } = require('../services/callingProviderRegistry');

const stubProvider = require('../services/callingProviders/stubProvider');
const twilioProvider = require('../services/callingProviders/twilioProvider');

function joinUrl(base, path) {
  const b = (base || '').replace(/\/$/, '');
  const p = (path || '').startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function getPublicBaseUrl() {
  return process.env.PUBLIC_BASE_URL || process.env.BACKEND_PUBLIC_URL || '';
}

function pickProvider(providerName) {
  switch ((providerName || 'stub').toLowerCase()) {
    case 'twilio':
      return { name: 'twilio', adapter: twilioProvider };
    case 'stub':
    default:
      return { name: 'stub', adapter: stubProvider };
  }
}

async function getLeadIdsForUser(user) {
  if (!user) return [];

  const role = (user.role || '').toLowerCase();
  if (role === 'super-admin' || role === 'head-admin') {
    return null; // means all
  }

  // Team leader / employee: use lead assignmentChain like existing leadService
  const leads = await Lead.find({ 'assignmentChain.userId': user._id.toString() }).select('_id').lean();
  return leads.map(l => l._id);
}

exports.startCall = async (req, res, next) => {
  try {
    const flags = await getFeatureFlags();
    if (!flags.CALLING_ENABLED) {
      return res.status(403).json({ success: false, message: 'Calling is disabled by admin.' });
    }

    const { phoneNumber, leadId } = req.body || {};
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'phoneNumber is required' });
    }

    const providerAccount = await getActiveProviderAccount();
    const provider = pickProvider(providerAccount?.providerName);

    const publicBaseUrl = getPublicBaseUrl();
    const webhookUrl = publicBaseUrl ? joinUrl(publicBaseUrl, '/api/webhooks/twilio/voice') : '';
    const statusCallbackUrl = publicBaseUrl ? joinUrl(publicBaseUrl, '/api/webhooks/twilio/status') : '';

    let providerResult;
    if (provider.name === 'twilio') {
      providerResult = await provider.adapter.startCall({
        to: phoneNumber,
        from: providerAccount?.defaultFromNumber,
        webhookUrl,
        statusCallbackUrl,
        accountSid: providerAccount?.credentials?.accountSid,
        authToken: providerAccount?.credentials?.authToken,
      });
    } else {
      providerResult = await provider.adapter.startCall({ to: phoneNumber });
    }

    const now = new Date();
    const callLog = await CallLog.create({
      leadId: leadId || undefined,
      createdByUserId: req.user?._id,
      assignedUserId: req.user?._id,
      phoneNumber,
      direction: 'outbound',
      status: 'ringing',
      startTime: now,
      provider: provider.name,
      providerCallId: providerResult.providerCallId,
      meta: { to: phoneNumber, provider: provider.name },
    });

    return res.status(201).json({ success: true, data: callLog });
  } catch (err) {
    next(err);
  }
};

exports.endCall = async (req, res, next) => {
  try {
    const { callLogId } = req.body || {};
    if (!callLogId) {
      return res.status(400).json({ success: false, message: 'callLogId is required' });
    }

    const callLog = await CallLog.findById(callLogId);
    if (!callLog) {
      return res.status(404).json({ success: false, message: 'Call log not found' });
    }

    const role = (req.user?.role || '').toLowerCase();
    const isAdmin = role === 'super-admin' || role === 'head-admin';
    const isOwner = callLog.assignedUserId?.toString() === req.user?._id?.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const providerAccount = await getActiveProviderAccount();
    const provider = pickProvider(callLog.provider);
    if (provider.name === 'twilio') {
      await provider.adapter.endCall({
        providerCallId: callLog.providerCallId,
        accountSid: providerAccount?.credentials?.accountSid,
        authToken: providerAccount?.credentials?.authToken,
      });
    } else {
      await provider.adapter.endCall({ providerCallId: callLog.providerCallId });
    }

    const endTime = new Date();
    const start = callLog.startTime ? new Date(callLog.startTime).getTime() : endTime.getTime();
    const durationSec = Math.max(0, Math.round((endTime.getTime() - start) / 1000));

    callLog.status = 'ended';
    callLog.endTime = endTime;
    callLog.durationSec = durationSec;
    await callLog.save();

    return res.json({ success: true, data: callLog });
  } catch (err) {
    next(err);
  }
};

exports.getConfig = async (req, res, next) => {
  try {
    const flags = await getFeatureFlags();
    return res.json({
      success: true,
      data: {
        CALLING_ENABLED: Boolean(flags.CALLING_ENABLED),
        RECORDING_ENABLED: Boolean(flags.RECORDING_ENABLED),
        MISSED_CALL_LEADS: Boolean(flags.MISSED_CALL_LEADS),
        WHATSAPP_AUTOMATION: Boolean(flags.WHATSAPP_AUTOMATION),
        EMAIL_TRACKING: Boolean(flags.EMAIL_TRACKING),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const { leadId, status, assignedUserId, phoneNumber } = req.query || {};

    const role = (req.user?.role || '').toLowerCase();
    const baseQuery = {};

    if (leadId) baseQuery.leadId = leadId;
    if (status) baseQuery.status = status;
    if (phoneNumber) baseQuery.phoneNumber = phoneNumber;

    if (role === 'super-admin' || role === 'head-admin') {
      if (assignedUserId) baseQuery.assignedUserId = assignedUserId;
    } else if (role === 'team-leader') {
      const leadIds = await getLeadIdsForUser(req.user);
      baseQuery.leadId = { $in: leadIds };
    } else {
      baseQuery.assignedUserId = req.user?._id;
    }

    const logs = await CallLog.find(baseQuery).sort({ createdAt: -1 }).limit(500);
    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

exports.updateNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, tags, disposition } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: 'Call log ID is required' });
    }

    const callLog = await CallLog.findById(id);
    if (!callLog) {
      return res.status(404).json({ success: false, message: 'Call log not found' });
    }

    const role = (req.user?.role || '').toLowerCase();
    const isAdmin = role === 'super-admin' || role === 'head-admin';
    const isOwner = callLog.assignedUserId?.toString() === req.user?._id?.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (typeof text === 'string') callLog.notes.text = text;
    if (Array.isArray(tags)) callLog.notes.tags = tags;
    if (typeof disposition === 'string') callLog.notes.disposition = disposition;
    callLog.notes.createdBy = req.user?._id;
    callLog.notes.createdAt = new Date();

    await callLog.save();

    return res.json({ success: true, data: callLog });
  } catch (err) {
    next(err);
  }
};

// Get call records for a specific user
exports.getUserCalls = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    console.log(`Fetching calls for user: ${userId}`);

    // Use direct MongoDB connection to access callrecords collection
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const callrecords = db.collection('callrecords');

    // Try both string and ObjectId
    const { ObjectId } = mongoose.Types;
    let callLogs = [];

    try {
      // Try with ObjectId first
      callLogs = await callrecords.find({ 
        userId: new ObjectId(userId)
      }).sort({ createdAt: -1 }).toArray();
      console.log(`ObjectId search found ${callLogs.length} records`);
    } catch (err) {
      console.log(`ObjectId search failed, trying string: ${err.message}`);
    }

    if (callLogs.length === 0) {
      // Try with string
      callLogs = await callrecords.find({ 
        userId: userId
      }).sort({ createdAt: -1 }).toArray();
      console.log(`String search found ${callLogs.length} records`);
    }

    // Debug: Show one record structure
    if (callLogs.length > 0) {
      console.log(`Sample record:`, JSON.stringify(callLogs[0], null, 2));
    }

    console.log(`Found ${callLogs.length} call logs for user ${userId}`);

    // Transform data to match expected format
    const transformedCalls = callLogs.map(call => ({
      _id: call._id,
      callDate: call.callDate || call.createdAt,
      startTime: call.startTime,
      endTime: call.endTime,
      duration: call.duration || 0,
      phone: call.phone,
      leadPhone: call.phone, // Phone is already the lead phone
      leadName: call.leadName || 'Unknown Lead',
      leadId: call.leadId,
      userId: call.userId,
      calledBy: 'Test', // Since we don't have user info
      status: call.status,
      direction: call.type || 'outbound'
    }));

    console.log(`Transformed ${transformedCalls.length} calls for user ${userId}`);

    return res.json({ 
      success: true, 
      data: transformedCalls,
      count: transformedCalls.length
    });

  } catch (err) {
    console.error('Error fetching user calls:', err);
    next(err);
  }
};
