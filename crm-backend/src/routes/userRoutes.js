const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { uploadProfileImage } = require('../middlewares/upload.middleware');

router.get('/me', auth, userController.getMe);
router.put('/profile', auth, userController.updateProfile);
router.post('/profile-image', auth, uploadProfileImage, userController.uploadProfileImage);
router.post('/search', auth, userController.searchUsers);

router.get('/', auth, userController.getUsers);
router.post('/', userController.createUser);

router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.patch('/:id', auth, userController.updateUser);
router.patch('/:id/modules', auth, userController.updateUserModules);
router.put('/:id/status', auth, userController.updateUserStatus);
router.delete('/:id', auth, userController.deleteUser);

// Test endpoint to check all users
router.get('/test-all', auth, async (req, res) => {
  try {
    const User = require('../models/userModel');
    const allUsers = await User.find({});
    console.log(' ALL USERS IN DB:', allUsers.length);
    res.json({
      success: true,
      totalUsers: allUsers.length,
      users: allUsers.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department
      }))
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;