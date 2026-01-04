const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middlewares/auth');

// BD Analytics routes - Place BEFORE /:id routes
router.get('/bd-status-summary', auth, leadController.getBDSummary);
router.get('/bd-status/:bdId', auth, leadController.getBDDetails);

// Place static routes BEFORE any /:id routes
router.get('/assignable-users', auth, leadController.getAssignableUsers);

router.get('/', auth, leadController.getLeads);
router.post('/', auth, leadController.createLead);
router.put('/:id', auth, leadController.updateLead);
router.patch('/:id/status', auth, leadController.updateLeadStatus);
router.delete('/:id', auth, leadController.deleteLead);
router.get('/:id', auth, leadController.getLeadById);

// Add follow-up to a lead
router.post('/:id/followups', auth, leadController.addFollowUp);

// Fetch all follow-ups for a lead
router.get('/:id/followups', auth, leadController.getFollowUps);

// Forward lead to next person in hierarchy
router.post('/:id/forward', auth, leadController.forwardLead);

// Save call record
router.post('/calls', auth, leadController.saveCallRecord);

// Get call records for current user
router.get('/calls', auth, leadController.getCallRecords);

// Get call history for specific lead
router.get('/:leadId/calls', auth, leadController.getLeadCallHistory);

module.exports = router;