const Notification = require('../models/notificationModel');

let io = null;

const setSocketIO = (ioInstance) => {
    io = ioInstance;
};

const createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();

        if (io) {
            // Emit to whole role or specific user
            if (data.recipientRole === 'all') {
                io.emit('newNotification', notification);
            } else if (data.recipientId) {
                io.to(data.recipientId.toString()).emit('newNotification', notification);
            } else {
                // Emit to all users with this role (simplified for now as broad emit)
                io.emit(`newNotification_${data.recipientRole}`, notification);
            }
        }
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

const getNotifications = async (query = {}, options = {}) => {
    const { limit = 20, skip = 0 } = options;
    return await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

const markAsRead = async (id) => {
    return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

const markAllAsRead = async (recipientId, recipientRole) => {
    const query = recipientId ? { recipientId } : { recipientRole };
    return await Notification.updateMany({ ...query, isRead: false }, { isRead: true });
};

module.exports = {
    setSocketIO,
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
};
