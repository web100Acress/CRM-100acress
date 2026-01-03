const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { requireAnyRole } = require('../middlewares/roleAccess');
const emailController = require('../controllers/emailController');
const emailTemplateController = require('../controllers/emailTemplateController');

router.get('/templates', auth, requireAnyRole(['super-admin']), emailTemplateController.listTemplates);
router.post('/templates', auth, requireAnyRole(['super-admin']), emailTemplateController.createTemplate);
router.put('/templates/:id', auth, requireAnyRole(['super-admin']), emailTemplateController.updateTemplate);
router.delete('/templates/:id', auth, requireAnyRole(['super-admin']), emailTemplateController.deleteTemplate);

router.get('/messages', auth, requireAnyRole(['super-admin']), emailController.listEmails);
router.post('/send', auth, requireAnyRole(['super-admin']), emailController.sendEmail);

router.get('/track/:trackingId.gif', emailController.trackOpenPixel);

module.exports = router;
