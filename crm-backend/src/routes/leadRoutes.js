const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middlewares/auth');

router.get('/', auth, leadController.getLeads);
router.post('/', auth, leadController.createLead);
router.get('/:id', auth, leadController.getLeadById);
router.put('/:id', auth, leadController.updateLead);
router.delete('/:id', auth, leadController.deleteLead);

// Add follow-up to a lead
router.post('/:id/followups', auth, leadController.addFollowUp);

// Fetch all follow-ups for a lead
router.get('/:id/followups', auth, leadController.getFollowUps);

module.exports = router; 