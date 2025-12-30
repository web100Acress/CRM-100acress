const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const callController = require('../controllers/callController');

router.get('/config', auth, callController.getConfig);
router.post('/start', auth, callController.startCall);
router.post('/end', auth, callController.endCall);
router.get('/logs', auth, callController.getLogs);
router.patch('/:id/notes', auth, callController.updateNotes);

module.exports = router;
