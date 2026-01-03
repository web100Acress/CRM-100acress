const WhatsAppMessage = require('../models/whatsappMessageModel');

exports.listMessages = async (req, res, next) => {
  try {
    const { leadId, phoneNumber } = req.query || {};
    const q = {};
    if (leadId) q.leadId = leadId;
    if (phoneNumber) q.phoneNumber = phoneNumber;

    const rows = await WhatsAppMessage.find(q).sort({ createdAt: -1 }).limit(500);
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { leadId, phoneNumber, body, mediaUrls } = req.body || {};
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'phoneNumber is required' });
    }

    const msg = await WhatsAppMessage.create({
      leadId: leadId || undefined,
      direction: 'outbound',
      phoneNumber,
      body: body || '',
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
      status: 'sent',
      provider: 'stub',
      createdByUserId: req.user?._id,
    });

    return res.status(201).json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};
