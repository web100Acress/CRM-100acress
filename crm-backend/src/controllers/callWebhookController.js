const CallLog = require('../models/callLogModel');
const Lead = require('../models/leadModel');
const User = require('../models/userModel');
const { getFeatureFlags } = require('../services/featureFlagService');

function xmlEscape(str) {
  return (str || '').toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizePhone(value) {
  return (value || '').toString().trim();
}

function mapTwilioStatusToCallStatus(callStatus) {
  const s = (callStatus || '').toLowerCase();
  if (['no-answer', 'busy'].includes(s)) return 'missed';
  if (['failed', 'canceled'].includes(s)) return 'failed';
  if (['completed'].includes(s)) return 'ended';
  if (['in-progress', 'answered'].includes(s)) return 'answered';
  if (['ringing'].includes(s)) return 'ringing';
  if (['queued', 'initiated'].includes(s)) return 'queued';
  return 'ended';
}

async function pickDefaultAssignee() {
  const superAdmin = await User.findOne({ role: 'super-admin' }).lean();
  if (superAdmin) return superAdmin;
  const headAdmin = await User.findOne({ role: 'head-admin' }).lean();
  if (headAdmin) return headAdmin;
  return null;
}

async function ensureMissedCallLead({ phone }) {
  const flags = await getFeatureFlags();
  if (!flags.MISSED_CALL_LEADS) {
    return null;
  }

  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const existing = await Lead.findOne({ phone: normalized });
  if (existing) return existing;

  const assignee = await pickDefaultAssignee();
  const assignedTo = assignee ? assignee._id.toString() : '';

  const emailSafe = normalized.replace(/[^0-9+]/g, '');

  const lead = await Lead.create({
    name: 'Missed Call Lead',
    email: `${emailSafe || 'unknown'}@missedcall.local`,
    phone: normalized,
    status: 'Cold',
    workProgress: 'pending',
    assignedTo,
    assignedBy: assignedTo,
    createdBy: assignee ? assignee._id : undefined,
    assignmentChain: assignee
      ? [
          {
            userId: assignee._id.toString(),
            role: assignee.role,
            name: assignee.name,
            assignedAt: new Date(),
            status: 'assigned',
          },
        ]
      : [],
  });

  return lead;
}

exports.twilioVoiceWebhook = async (req, res, next) => {
  try {
    const callSid = req.body?.CallSid;
    const from = normalizePhone(req.body?.From);
    const to = normalizePhone(req.body?.To);
    const direction = (req.body?.Direction || 'inbound').includes('inbound') ? 'inbound' : 'outbound';

    if (callSid) {
      await CallLog.findOneAndUpdate(
        { provider: 'twilio', providerCallId: callSid },
        {
          $setOnInsert: {
            provider: 'twilio',
            providerCallId: callSid,
            phoneNumber: direction === 'inbound' ? from : to,
            direction,
            status: 'ringing',
            startTime: new Date(),
            meta: { from, to },
          },
        },
        { upsert: true, new: true }
      );
    }

    // MVP: forward to a configured number if present, otherwise play message.
    // Configure in ProviderAccount.credentials.forwardTo
    const twilioAccount = await require('../models/providerAccountModel').findOne({ providerName: 'twilio', isActive: true }).lean();
    const forwardTo = twilioAccount?.credentials?.forwardTo;

    let twiml = '';
    if (forwardTo) {
      const safe = xmlEscape(forwardTo);
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="20">${safe}</Dial>
  <Say voice="alice">Sorry, we missed your call. Our team will call you back.</Say>
</Response>`;
    } else {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thanks for calling. We will call you back shortly.</Say>
  <Hangup />
</Response>`;
    }

    res.set('Content-Type', 'text/xml');
    return res.status(200).send(twiml);
  } catch (err) {
    next(err);
  }
};

exports.twilioStatusWebhook = async (req, res, next) => {
  try {
    const callSid = req.body?.CallSid;
    const callStatus = req.body?.CallStatus;
    const callDuration = Number(req.body?.CallDuration || 0);
    const from = normalizePhone(req.body?.From);
    const to = normalizePhone(req.body?.To);
    const direction = (req.body?.Direction || '').includes('inbound') ? 'inbound' : 'outbound';

    if (!callSid) {
      return res.status(200).json({ success: true });
    }

    const mappedStatus = mapTwilioStatusToCallStatus(callStatus);

    const update = {
      status: mappedStatus,
      meta: { from, to, callStatus },
    };

    if (mappedStatus === 'ended' || mappedStatus === 'missed' || mappedStatus === 'failed') {
      update.endTime = new Date();
      update.durationSec = callDuration || 0;
    }

    const callLog = await CallLog.findOneAndUpdate(
      { provider: 'twilio', providerCallId: callSid },
      { $set: update, $setOnInsert: { provider: 'twilio', providerCallId: callSid, phoneNumber: direction === 'inbound' ? from : to, direction, startTime: new Date() } },
      { upsert: true, new: true }
    );

    if (direction === 'inbound' && mappedStatus === 'missed') {
      const lead = await ensureMissedCallLead({ phone: from });
      if (lead && callLog && !callLog.leadId) {
        callLog.leadId = lead._id;
        await callLog.save();
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
