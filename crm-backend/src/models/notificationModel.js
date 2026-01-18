const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['lead_created', 'lead_assigned', 'lead_forwarded', 'lead_reassigned', 'lead_bd_activity', 'lead_swapped', 'followup_added', 'system', 'task'],
        default: 'system'
    },
    recipientRole: {
        type: String,
        enum: ['boss', 'hod', 'team-leader', 'bd', 'all'],
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        type: mongoose.Schema.Types.Mixed // For storing things like leadId or external links
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
