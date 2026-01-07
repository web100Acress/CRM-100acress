const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { requireAnyRole } = require('../middlewares/roleAccess');
const emailController = require('../controllers/emailController');
const emailTemplateController = require('../controllers/emailTemplateController');

router.get('/templates', auth, requireAnyRole(['boss']), emailTemplateController.listTemplates);
router.post('/templates', auth, requireAnyRole(['boss']), emailTemplateController.createTemplate);
router.put('/templates/:id', auth, requireAnyRole(['boss']), emailTemplateController.updateTemplate);
router.delete('/templates/:id', auth, requireAnyRole(['boss']), emailTemplateController.deleteTemplate);

router.get('/messages', auth, requireAnyRole(['boss']), emailController.listEmails);
router.post('/send', auth, requireAnyRole(['boss']), emailController.sendEmail);


router.get('/track/:trackingId.gif', emailController.trackOpenPixel);

module.exports = router;
