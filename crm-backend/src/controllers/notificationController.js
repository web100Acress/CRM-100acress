const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;

        // Get notifications for this specific user or for their role
        const query = {
            $or: [
                { recipientId: userId },
                { recipientRole: userRole },
                { recipientRole: 'all' }
            ]
        };

        const notifications = await notificationService.getNotifications(query);
        res.json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.markAsRead(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;
        await notificationService.markAllAsRead(userId, userRole);
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};
