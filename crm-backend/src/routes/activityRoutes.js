const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middlewares/auth');

// Activity Department Routes
router.post('/departments', authMiddleware, activityController.createActivityDepartment);
router.get('/departments', activityController.getAllActivityDepartments);
router.post('/departments/login', activityController.activityDepartmentLogin);

// Report Routes
router.post('/reports', activityController.submitReport);
router.get('/reports', activityController.getAllReports);
router.get('/reports/department/:department', activityController.getReportsByDepartment);

// File Routes
router.post('/files', activityController.shareFile);
router.get('/files', activityController.getAllFiles);
router.get('/files/department/:department', activityController.getFilesByDepartment);

// Content Routes
router.post('/content', activityController.shareContent);
router.get('/content', activityController.getAllContent);
router.get('/content/department/:department', activityController.getContentByDepartment);
router.post('/content/:contentId/comment', activityController.addCommentToContent);
router.post('/content/:contentId/like', activityController.likeContent);

// Thought Routes
router.post('/thoughts', activityController.shareThought);
router.get('/thoughts', activityController.getAllThoughts);
router.get('/thoughts/department/:department', activityController.getThoughtsByDepartment);
router.post('/thoughts/:thoughtId/reply', activityController.addReplyToThought);
router.post('/thoughts/:thoughtId/like', activityController.likeThought);

module.exports = router;
