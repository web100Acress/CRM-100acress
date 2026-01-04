const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth, userController.getMe);
router.get('/', auth, userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.patch('/:id', auth, userController.updateUser);
router.patch('/:id/modules', auth, userController.updateUserModules);
router.put('/:id/status', auth, userController.updateUserStatus);
router.delete('/:id', auth, userController.deleteUser);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;