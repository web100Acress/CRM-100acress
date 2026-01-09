const Lead = require('../models/leadModel');
const ChatMessage = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// 🎯 FINAL LOGIC: Direct Lead Assignment = Direct Chat
exports.assignLead = async (req, res, next) => {
  try {
    const { leadId, assigneeId, assigneeName, assigneeRole, notes } = req.body;
    
    // Get current user (assigner)
    const assignerId = req.user?.userId || req.user?._id;
    const assignerRole = req.user?.role;
    
    if (!leadId || !assigneeId) {
      return res.status(400).json({
        success: false,
        message: 'leadId and assigneeId are required'
      });
    }

    // 🚫 Self assignment check
    if (assignerId === assigneeId) {
      return res.status(400).json({
        success: false,
        message: 'Self assignment not allowed'
      });
    }

    // Get lead details
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Get assigner details
    const assigner = await User.findById(assignerId);
    if (!assigner) {
      return res.status(404).json({
        success: false,
        message: 'Assigner not found'
      });
    }

    // Get assignee details
    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({
        success: false,
        message: 'Assignee not found'
      });
    }

    // 🎯 GOLDEN RULE: Create chat between assigner and assignee
    const participants = [assignerId, assigneeId];
    
    // Check if chat already exists for this assignment
    const existingChat = await Chat.findOne({
      leadId,
      participants: { $all: participants, $size: 2 }
    });

    if (!existingChat) {
      // Create new chat
      await Chat.create({
        leadId,
        participants,
        createdBy: assignerId,
        assignedTo: assigneeId,
        lastMessage: {
          message: `Lead "${lead.name}" assigned to ${assignee.name}`,
          senderId: assignerId,
          timestamp: new Date()
        }
      });

      console.log(`✅ Chat created: ${assigner.name} ↔ ${assignee.name} for lead: ${lead.name}`);
    } else {
      console.log(`ℹ️ Chat already exists: ${assigner.name} ↔ ${assignee.name}`);
    }

    // Update lead assignment
    lead.assignedTo = assigneeId;
    lead.assignedBy = assignerId;
    
    // Add to assignment chain
    lead.assignmentChain.push({
      userId: assigneeId,
      role: assigneeRole || assignee.role,
      name: assigneeName || assignee.name,
      assignedBy: {
        _id: assignerId,
        name: assigner.name,
        role: assignerRole || assigner.role
      },
      assignedAt: new Date(),
      status: 'assigned',
      notes: notes || `Lead assigned by ${assigner.name}`,
      chatCreated: true // Mark chat as created
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: `Lead assigned to ${assignee.name} successfully`,
      data: {
        leadId,
        assigner: {
          id: assignerId,
          name: assigner.name,
          role: assigner.role
        },
        assignee: {
          id: assigneeId,
          name: assignee.name,
          role: assignee.role
        },
        chatCreated: !existingChat
      }
    });

  } catch (error) {
    console.error('Error assigning lead:', error);
    next(error);
  }
};

// Get all chats for a specific lead
exports.getChatsByLead = async (req, res, next) => {
  try {
    const { leadId } = req.query;
    const currentUserId = req.user?.userId || req.user?._id;

    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: 'leadId is required'
      });
    }

    // Get all chats for this lead
    const chats = await Chat.find({
      leadId,
      participants: currentUserId // Only chats where current user is participant
    })
    .populate('participants', 'name role email')
    .populate('leadId', 'name email phone')
    .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: chats
    });

  } catch (error) {
    console.error('Error getting chats by lead:', error);
    next(error);
  }
};

// Get all chats for current user
exports.getUserChats = async (req, res, next) => {
  try {
    const currentUserId = req.user?.userId || req.user?._id;

    // Get all chats where user is participant
    const chats = await Chat.find({
      participants: currentUserId
    })
    .populate('participants', 'name role email')
    .populate('leadId', 'name email phone status')
    .populate('createdBy', 'name')
    .populate('assignedTo', 'name')
    .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: chats
    });

  } catch (error) {
    console.error('Error getting user chats:', error);
    next(error);
  }
};
