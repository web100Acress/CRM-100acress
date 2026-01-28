const EmailTemplate = require('../models/emailTemplateModel');

exports.listTemplates = async (req, res, next) => {
  try {
    const rows = await EmailTemplate.find({}).sort({ updatedAt: -1 });
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

exports.createTemplate = async (req, res, next) => {
  try {
    const { name, subject, html, isActive } = req.body || {};
    if (!name || !subject || !html) {
      return res.status(400).json({ success: false, message: 'name, subject, html are required' });
    }

    const created = await EmailTemplate.create({
      name,
      subject,
      html,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Template name already exists' });
    }
    next(err);
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subject, html, isActive } = req.body || {};

    const tpl = await EmailTemplate.findById(id);
    if (!tpl) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    if (typeof name === 'string') tpl.name = name;
    if (typeof subject === 'string') tpl.subject = subject;
    if (typeof html === 'string') tpl.html = html;
    if (typeof isActive === 'boolean') tpl.isActive = isActive;
    tpl.updatedBy = req.user?._id;

    await tpl.save();
    return res.json({ success: true, data: tpl });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Template name already exists' });
    }
    next(err);
  }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tpl = await EmailTemplate.findByIdAndDelete(id);
    if (!tpl) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    return res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    next(err);
  }
};
