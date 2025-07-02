const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middlewares/auth');

router.get('/', auth, leadController.getLeads);
router.post('/', auth, leadController.createLead);
router.get('/:id', auth, leadController.getLeadById);
router.put('/:id', auth, leadController.updateLead);
router.delete('/:id', auth, leadController.deleteLead);

module.exports = router; 