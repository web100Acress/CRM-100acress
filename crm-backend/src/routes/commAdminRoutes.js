const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { requireAnyRole } = require('../middlewares/roleAccess');
const commAdminController = require('../controllers/commAdminController');

router.get('/feature-flags', auth, requireAnyRole(['boss']), commAdminController.getFeatureFlags);
router.put('/feature-flags', auth, requireAnyRole(['boss']), commAdminController.updateFeatureFlags);

router.get('/providers', auth, requireAnyRole(['boss']), commAdminController.listProviders);
router.put('/providers', auth, requireAnyRole(['boss']), commAdminController.upsertProvider);

module.exports = router;
