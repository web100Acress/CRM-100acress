const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

let io = null;

const setSocketIO = (ioInstance) => {
    io = ioInstance;
};

const getRelevantUsersForBDActivity = async (currentUserId) => {
    try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser || currentUser.role !== 'bd') {
            return [];
        }

        // Get all relevant managers for BD activities
        const bossUsers = await User.find({ role: 'boss' });
        const hodUsers = await User.find({ role: 'hod' });
        const teamLeaderUsers = await User.find({ role: 'team-leader' });

        const recipients = [
            ...bossUsers.map(u => ({ userId: u._id, role: 'boss' })),
            ...hodUsers.map(u => ({ userId: u._id, role: 'hod' })),
            ...teamLeaderUsers.map(u => ({ userId: u._id, role: 'team-leader' }))
        ];

        console.log('🔔 BD Activity - Notifying managers:', {
            total: recipients.length,
            boss: bossUsers.length,
            hod: hodUsers.length,
            teamLeader: teamLeaderUsers.length
        });

        return recipients;
    } catch (error) {
        console.error('Error getting relevant users for BD activity:', error);
        return [];
    }
};

const createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();

        if (io) {
            // Handle multiple recipients for BD activities
            if (data.recipients && Array.isArray(data.recipients)) {
                // Send to multiple specific users
                data.recipients.forEach(recipient => {
                    if (recipient.userId) {
                        io.to(recipient.userId.toString()).emit('newNotification', notification);
                    } else if (recipient.role) {
                        io.emit(`newNotification_${recipient.role}`, notification);
                    }
                });
            }
            // Emit to whole role or specific user (existing logic)
            else if (data.recipientRole === 'all') {
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

const getSocketIO = () => {
    return io;
};

module.exports = {
    setSocketIO,
    getSocketIO,
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getRelevantUsersForBDActivity
};
