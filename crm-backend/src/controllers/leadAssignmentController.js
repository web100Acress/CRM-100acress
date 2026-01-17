const Lead = require('../models/leadModel');
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

    // 🎯 GOLDEN RULE: Create WhatsApp-style chat between assigner and assignee
    const participants = [assignerId, assigneeId];

    // Check if chat already exists between these users (ignoring leadId to avoid duplicates)
    let existingChat = await Chat.findOne({
      participants: { $all: participants }
    }).populate('participants', 'name role email profileImage about');

    if (!existingChat) {
      // Create new WhatsApp-style chat
      existingChat = new Chat({
        leadId,
        participants,
        lastMessage: {
          message: `Lead "${lead.name}" assigned to ${assignee.name}`,
          senderId: assignerId,
          timestamp: new Date()
        }
      });
      await existingChat.save();

      // Populate participants
      await existingChat.populate('participants', 'name role email profileImage about');

      console.log(`✅ WhatsApp Chat created: ${assigner.name} ↔ ${assignee.name} for lead: ${lead.name}`);
    } else {
      console.log(`ℹ️ WhatsApp Chat already exists: ${assigner.name} ↔ ${assignee.name}`);
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
        chat: existingChat,
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
        chatCreated: true
      }
    });

  } catch (error) {
    console.error('Error assigning lead:', error);
    next(error);
  }
};

// Get all chats for current user (WhatsApp style)
exports.getUserChats = async (req, res, next) => {
  try {
    const currentUserId = req.user?.userId || req.user?._id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { otherUserId } = req.query;

    // Build query
    let query = { participants: currentUserId };

    // If otherUserId is provided, filter chats to include both users
    if (otherUserId) {
      query.participants = { $all: [currentUserId, otherUserId] };
    }

    // Get all chats where user is participant
    const chats = await Chat.find(query)
      .populate('participants', 'name role email profileImage about')
      .populate('leadId', 'name email phone status')
      .sort({ updatedAt: -1 });

    // Deduplicate chats based on participants (show only one chat per contact pair)
    const uniqueChatsMap = new Map();

    chats.forEach(chat => {
      // Find the other participant's ID
      const otherParticipant = chat.participants.find(u => u._id.toString() !== currentUserId.toString());
      const otherId = otherParticipant ? otherParticipant._id.toString() : 'unknown';

      // Since they are sorted by updatedAt descending, the first one we find is the latest
      if (!uniqueChatsMap.has(otherId)) {
        uniqueChatsMap.set(otherId, chat);
      }
    });

    const dedupedChats = Array.from(uniqueChatsMap.values());

    // Format for frontend
    const formattedChats = dedupedChats.map(chat => {
      const oppositeUser = chat.participants.find(u => u._id.toString() !== currentUserId.toString());
      const unreadCount = chat.unreadCount.get(currentUserId.toString()) || 0;

      return {
        _id: chat._id,
        leadId: chat.leadId,
        participants: chat.participants,
        oppositeUser: {
          _id: oppositeUser?._id,
          name: oppositeUser?.name,
          role: oppositeUser?.role,
          email: oppositeUser?.email,
          profileImage: oppositeUser?.profileImage,
          about: oppositeUser?.about
        },
        lastMessage: chat.lastMessage,
        unreadCount,
        updatedAt: chat.updatedAt
      };
    });

    res.status(200).json({
      success: true,
      data: formattedChats
    });

  } catch (error) {
    console.error('Error getting user chats:', error);
    next(error);
  }
};
