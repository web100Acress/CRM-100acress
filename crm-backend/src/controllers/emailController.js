const crypto = require('crypto');
const EmailTemplate = require('../models/emailTemplateModel');
const EmailMessage = require('../models/emailMessageModel');
const { sendMail } = require('../services/emailService');

function renderTemplate(html, variables) {
  let out = html || '';
  const vars = variables && typeof variables === 'object' ? variables : {};
  for (const [k, v] of Object.entries(vars)) {
    const safe = String(v);
    out = out.split(`{{${k}}}`).join(safe);
  }
  return out;
}

function getPublicBaseUrl() {
  return process.env.PUBLIC_BASE_URL || process.env.BACKEND_PUBLIC_URL || '';
}

exports.sendEmail = async (req, res, next) => {
  try {
    const { leadId, to, templateId, subject, variables } = req.body || {};
    if (!to) {
      return res.status(400).json({ success: false, message: 'to is required' });
    }
    if (!templateId) {
      return res.status(400).json({ success: false, message: 'templateId is required' });
    }

    const tpl = await EmailTemplate.findById(templateId);
    if (!tpl) {
      return res.status(404).json({ success: false, message: 'Email template not found' });
    }

    const trackingId = crypto.randomBytes(16).toString('hex');
    const publicBase = getPublicBaseUrl();
    const pixelUrl = publicBase ? `${publicBase.replace(/\/$/, '')}/api/email/track/${trackingId}.gif` : '';

    const compiledHtml = renderTemplate(tpl.html, variables);
    const htmlWithPixel = pixelUrl
      ? `${compiledHtml}\n<img src=\"${pixelUrl}\" width=\"1\" height=\"1\" style=\"display:none\" alt=\"\" />`
      : compiledHtml;

    const msg = await EmailMessage.create({
      leadId: leadId || undefined,
      to,
      subject: subject || tpl.subject,
      provider: 'smtp',
      status: 'queued',
      trackingId,
      createdByUserId: req.user?._id,
    });

    try {
      await sendMail(to, msg.subject, msg.subject, htmlWithPixel);
      msg.status = 'sent';
      await msg.save();
    } catch (e) {
      msg.status = 'failed';
      await msg.save();
      throw e;
    }

    return res.status(201).json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};

exports.listEmails = async (req, res, next) => {
  try {
    const { leadId, to } = req.query || {};
    const q = {};
    if (leadId) q.leadId = leadId;
    if (to) q.to = to;

    const rows = await EmailMessage.find(q).sort({ createdAt: -1 }).limit(500);
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

exports.trackOpenPixel = async (req, res, next) => {
  try {
    const { trackingId } = req.params;

    if (trackingId) {
      await EmailMessage.findOneAndUpdate(
        { trackingId },
        { $set: { status: 'opened', openedAt: new Date() } },
        { new: true }
      );
    }

    const gifBase64 = 'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    const buf = Buffer.from(gifBase64, 'base64');
    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).send(buf);
  } catch (err) {
    next(err);
  }
};
