const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Lead = require('../models/leadModel');

// 🎯 WhatsApp Style Chat System
exports.createOrGetChat = async (req, res, next) => {
  try {
    const { leadId, createdBy, assignedTo } = req.body;

    if (!leadId || !createdBy || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'leadId, createdBy, and assignedTo are required'
      });
    }

    // 🚫 Self assignment check
    if (String(createdBy) === String(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Self assignment not allowed'
      });
    }

    // 🔍 Get both users to check their roles
    const createdByUser = await User.findById(createdBy);
    const assignedToUser = await User.findById(assignedTo);

    if (!createdByUser || !assignedToUser) {
      return res.status(404).json({
        success: false,
        message: 'One or both users not found'
      });
    }

    // Normalize roles to lowercase for comparison
    const normalizeRole = (role) => {
      if (!role) return '';
      const r = String(role).trim().toLowerCase();
      if (r === 'boss' || r === 'super-admin' || r === 'superadmin') return 'boss';
      if (r === 'hod' || r === 'head-admin' || r === 'head' || r === 'head_admin') return 'hod';
      if (r === 'team-leader' || r === 'team_leader') return 'team-leader';
      if (r === 'bd' || r === 'employee') return 'bd';
      return r;
    };

    const createdByRole = normalizeRole(createdByUser.role);
    const assignedToRole = normalizeRole(assignedToUser.role);

    // ✅ ROLE-BASED VALIDATION: Boss, HOD, Team Leader, and BD can chat with each other
    const allowedRoles = ['boss', 'hod', 'team-leader', 'bd'];
    const isCreatedByAllowed = allowedRoles.includes(createdByRole);
    const isAssignedToAllowed = allowedRoles.includes(assignedToRole);

    // Log for debugging
    console.log('🔍 CHAT VALIDATION DEBUG:', {
      leadId,
      createdBy,
      assignedTo,
      createdByRole,
      assignedToRole,
      isCreatedByAllowed,
      isAssignedToAllowed
    });

    // ✅ PRIORITY 1: If both users have valid roles (Boss/HOD/Team Leader/BD), allow chat
    if (isCreatedByAllowed && isAssignedToAllowed) {
      console.log('✅ ROLE-BASED PERMISSION: Both users have valid roles - Chat allowed');

      // Check if chat already exists between these users (ignoring leadId to avoid duplicates)
      let chat = await Chat.findOne({
        participants: { $all: [createdBy, assignedTo] }
      }).populate('participants', 'name role email profileImage about')
        .populate('messages.senderId', 'name role email');

      if (!chat) {
        // Create new WhatsApp-style chat
        chat = new Chat({
          leadId,
          participants: [createdBy, assignedTo],
          lastMessage: {
            message: `Chat started`,
            senderId: createdBy,
            timestamp: new Date()
          }
        });
        await chat.save();

        // Populate participants and messages
        await chat.populate('participants', 'name role email profileImage about');
        await chat.populate('messages.senderId', 'name role email');
      }

      return res.status(200).json({
        success: true,
        data: chat
      });
    }

    // 🔒 FALLBACK: Assignment chain validation for other cases
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const assignmentChain = Array.isArray(lead.assignmentChain) ? lead.assignmentChain : [];

    // Helper function to get assigner ID from entry
    const getAssignerId = (entry) => {
      if (!entry?.assignedBy) return null;
      if (typeof entry.assignedBy === 'string') return entry.assignedBy;
      if (entry.assignedBy._id) return String(entry.assignedBy._id);
      return null;
    };

    // Check if both users are in the assignment chain
    const createdByInChain = assignmentChain.some(
      entry => String(entry.userId) === String(createdBy)
    );
    const assignedToInChain = assignmentChain.some(
      entry => String(entry.userId) === String(assignedTo)
    );

    // Also check current assigned user and lead.assignedBy
    const isCreatedByCurrentAssigned = String(lead.assignedTo) === String(createdBy);
    const isAssignedToCurrentAssigned = String(lead.assignedTo) === String(assignedTo);
    const isCreatedByAssignedBy = String(lead.assignedBy) === String(createdBy);
    const isAssignedToAssignedBy = String(lead.assignedBy) === String(assignedTo);

    console.log('🔍 ASSIGNMENT CHAIN VALIDATION:', {
      leadAssignedTo: lead.assignedTo,
      leadAssignedBy: lead.assignedBy,
      assignmentChainLength: assignmentChain.length,
      createdByInChain,
      assignedToInChain,
      isCreatedByCurrentAssigned,
      isAssignedToCurrentAssigned,
      isCreatedByAssignedBy,
      isAssignedToAssignedBy
    });

    // Both users must be in chain or currently assigned/assignedBy
    if (!(createdByInChain || isCreatedByCurrentAssigned || isCreatedByAssignedBy) ||
      !(assignedToInChain || isAssignedToCurrentAssigned || isAssignedToAssignedBy)) {
      console.log('❌ VALIDATION FAILED: Users not in assignment chain and roles not eligible');
      return res.status(403).json({
        success: false,
        message: 'Chat not allowed: Users must have valid roles (Boss/HOD/Team Leader/BD) or be in the assignment chain.'
      });
    }

    // Validate: Check if they form a consecutive pair in the chain
    let isValidPair = false;

    // Case 1: createdBy assigned to assignedTo (createdBy → assignedTo)
    const assignedToEntry = assignmentChain.find(
      entry => String(entry.userId) === String(assignedTo)
    );

    if (assignedToEntry) {
      const assignerId = getAssignerId(assignedToEntry);
      if (assignerId && String(assignerId) === String(createdBy)) {
        isValidPair = true;
        console.log('✅ Case 1: createdBy is assigner of assignedTo');
      }
    }

    // Case 2: assignedTo assigned to createdBy (assignedTo → createdBy)
    if (!isValidPair) {
      const createdByEntry = assignmentChain.find(
        entry => String(entry.userId) === String(createdBy)
      );

      if (createdByEntry) {
        const assignerId = getAssignerId(createdByEntry);
        if (assignerId && String(assignerId) === String(assignedTo)) {
          isValidPair = true;
          console.log('✅ Case 2: assignedTo is assigner of createdBy');
        }
      }
    }

    // Case 3: Direct assignment check (lead.assignedBy → lead.assignedTo)
    if (!isValidPair) {
      if (isCreatedByAssignedBy && isAssignedToCurrentAssigned) {
        isValidPair = true;
        console.log('✅ Case 3: Direct assignment (assignedBy → assignedTo)');
      } else if (isAssignedToAssignedBy && isCreatedByCurrentAssigned) {
        isValidPair = true;
        console.log('✅ Case 3b: Reverse direct assignment (assignedTo → createdBy)');
      }
    }

    // Case 4: Both are in chain and could be consecutive (check all pairs)
    if (!isValidPair && createdByInChain && assignedToInChain) {
      for (const entry of assignmentChain) {
        const assignerId = getAssignerId(entry);
        const entryUserId = String(entry.userId);

        if (assignerId && String(assignerId) === String(createdBy) && entryUserId === String(assignedTo)) {
          isValidPair = true;
          console.log('✅ Case 4: Found consecutive pair in chain (createdBy → assignedTo)');
          break;
        }

        if (assignerId && String(assignerId) === String(assignedTo) && entryUserId === String(createdBy)) {
          isValidPair = true;
          console.log('✅ Case 4b: Found consecutive pair in chain (assignedTo → createdBy)');
          break;
        }
      }
    }

    // Case 5: Check consecutive entries in chain
    if (!isValidPair && assignmentChain.length >= 2) {
      for (let i = 0; i < assignmentChain.length - 1; i++) {
        const currentEntry = assignmentChain[i];
        const nextEntry = assignmentChain[i + 1];
        const currentUserIdStr = String(currentEntry.userId);
        const nextUserIdStr = String(nextEntry.userId);

        const nextAssignerId = getAssignerId(nextEntry);
        const isActualAssignment = nextAssignerId && String(nextAssignerId) === currentUserIdStr;

        if (isActualAssignment) {
          if ((currentUserIdStr === String(createdBy) && nextUserIdStr === String(assignedTo)) ||
            (currentUserIdStr === String(assignedTo) && nextUserIdStr === String(createdBy))) {
            isValidPair = true;
            console.log('✅ Case 5: Users are consecutive in assignment chain with valid assignment relationship');
            break;
          }
        }
      }
    }

    if (!isValidPair) {
      console.log('❌ VALIDATION FAILED: Users do not form a valid consecutive pair');
      return res.status(403).json({
        success: false,
        message: 'Chat not allowed: Users must be consecutive pairs in the assignment chain (assigner ↔ assigned user).',
        debug: {
          createdBy,
          assignedTo,
          createdByRole,
          assignedToRole,
          assignmentChainLength: assignmentChain.length
        }
      });
    }

    // Check if chat already exists between these users (ignoring leadId to avoid duplicates)
    let chat = await Chat.findOne({
      participants: { $all: [createdBy, assignedTo] }
    }).populate('participants', 'name role email profileImage about')
      .populate('messages.senderId', 'name role email');

    if (!chat) {
      // Create new WhatsApp-style chat
      chat = new Chat({
        leadId,
        participants: [createdBy, assignedTo],
        lastMessage: {
          message: `Lead assigned`,
          senderId: createdBy,
          timestamp: new Date()
        }
      });
      await chat.save();

      // Populate participants and messages
      await chat.populate('participants', 'name role email profileImage about');
      await chat.populate('messages.senderId', 'name role email');
    }

    res.status(200).json({
      success: true,
      data: chat
    });

  } catch (err) {
    next(err);
  }
};

// Send message in WhatsApp style
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, message, senderId, messageType = 'text', attachmentUrl = null } = req.body;

    if (!chatId || !message || !senderId) {
      return res.status(400).json({
        success: false,
        message: 'chatId, message, and senderId are required'
      });
    }

    // Security: Check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.map(id => id.toString()).includes(senderId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Not a participant'
      });
    }

    // Add message to chat
    const newMessage = {
      senderId,
      message: message.trim(),
      timestamp: new Date(),
      status: 'sent',
      messageType,
      attachmentUrl
    };

    chat.messages.push(newMessage);

    // Update last message
    chat.lastMessage = {
      message: message.trim(),
      senderId,
      timestamp: new Date()
    };

    // Update unread count for other participant
    const otherParticipant = chat.participants.find(id => id.toString() !== senderId);
    if (otherParticipant) {
      const currentCount = chat.unreadCount.get(otherParticipant.toString()) || 0;
      chat.unreadCount.set(otherParticipant.toString(), currentCount + 1);
    }

    await chat.save();

    // Populate and return
    await chat.populate('participants', 'name role email');
    await chat.populate('messages.senderId', 'name role email');

    res.status(201).json({
      success: true,
      data: {
        chatId: chat._id,
        message: newMessage,
        senderName: chat.participants.find(p => p._id.toString() === senderId)?.name
      }
    });

  } catch (err) {
    next(err);
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.query;
    const currentUserId = req.user?.userId || req.user?._id;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'chatId is required'
      });
    }

    // Security: Check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.map(id => id.toString()).includes(currentUserId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Not a participant'
      });
    }

    // Mark messages as read for current user
    chat.unreadCount.set(currentUserId, 0);
    await chat.save();

    // Get chat with populated messages
    const populatedChat = await Chat.findById(chatId)
      .populate('participants', 'name role email')
      .populate('messages.senderId', 'name role email');

    res.status(200).json({
      success: true,
      data: populatedChat.messages || []
    });

  } catch (err) {
    next(err);
  }
};

// Get all chats for current user
exports.getUserChats = async (req, res, next) => {
  try {
    const currentUserId = req.user?.userId || req.user?._id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get all chats where user is participant
    const chats = await Chat.find({
      participants: currentUserId
    })
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

  } catch (err) {
    next(err);
  }
};

// Mark messages as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const currentUserId = req.user?.userId || req.user?._id;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'chatId is required'
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Not a participant'
      });
    }

    // Mark as read
    chat.unreadCount.set(currentUserId, 0);
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (err) {
    next(err);
  }
};

// Create chat with selected user (for user search functionality)
exports.createChat = async (req, res, next) => {
  try {
    const { participantId, participantName, participantEmail, participantRole } = req.body;
    const currentUserId = req.user?.userId || req.user?.id || req.user?._id;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'participantId is required'
      });
    }

    // 🚫 Self assignment check
    if (String(participantId) === String(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Self assignment not allowed'
      });
    }

    // 🔍 Get both users to check their roles
    const currentUser = await User.findById(currentUserId);
    const participantUser = await User.findById(participantId);

    if (!currentUser || !participantUser) {
      return res.status(404).json({
        success: false,
        message: 'One or both users not found'
      });
    }

    // Normalize roles to lowercase for comparison
    const normalizeRole = (role) => {
      if (!role) return '';
      const r = String(role).trim().toLowerCase();
      if (r === 'boss' || r === 'super-admin' || r === 'superadmin') return 'boss';
      if (r === 'hod' || r === 'head-admin' || r === 'head' || r === 'head_admin') return 'hod';
      if (r === 'team-leader' || r === 'team_leader') return 'team-leader';
      if (r === 'bd' || r === 'employee') return 'bd';
      return r;
    };

    const currentUserRole = normalizeRole(currentUser.role);
    const participantUserRole = normalizeRole(participantUser.role);

    // ✅ ROLE-BASED VALIDATION: Boss, HOD, Team Leader, and BD can chat with each other
    const allowedRoles = ['boss', 'hod', 'team-leader', 'bd'];
    const isCurrentUserAllowed = allowedRoles.includes(currentUserRole);
    const isParticipantAllowed = allowedRoles.includes(participantUserRole);

    // Allow chat if both users have allowed roles (any combination between Boss, HOD, Team Leader, and BD)
    if (!isCurrentUserAllowed || !isParticipantAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Chat not allowed between these roles'
      });
    }

    // 🔍 Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [currentUserId, participantId] }
    }).populate('participants', 'name role email profileImage about')
      .populate('leadId', 'name email phone status');

    if (existingChat) {
      return res.status(200).json({
        success: true,
        message: 'Chat already exists',
        chat: existingChat
      });
    }

    // 🆕 Create new chat (without lead requirement)
    const newChat = new Chat({
      participants: [currentUserId, participantId],
      createdBy: currentUserId,
      lastMessage: null,
      unreadCount: new Map([[participantId, 0], [currentUserId, 0]])
    });

    await newChat.save();

    // Populate the new chat
    await newChat.populate('participants', 'name role email profileImage about');

    const formattedChat = {
      _id: newChat._id,
      leadId: null, // No lead associated for user search chats
      participants: newChat.participants,
      oppositeUser: {
        _id: participantUser._id,
        name: participantUser.name,
        role: participantUser.role,
        email: participantUser.email,
        profileImage: participantUser.profileImage,
        about: participantUser.about
      },
      lastMessage: null,
      unreadCount: 0,
      updatedAt: newChat.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      chat: formattedChat
    });

  } catch (err) {
    console.error('Error creating chat:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Toggle Mute Chat
exports.toggleMuteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    const index = chat.mutedBy.indexOf(userId);
    if (index > -1) {
      chat.mutedBy.splice(index, 1);
    } else {
      chat.mutedBy.push(userId);
    }

    await chat.save();
    res.json({ success: true, isMuted: chat.mutedBy.includes(userId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Block User
exports.blockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const myId = req.user._id;

    const user = await User.findById(myId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const index = user.blockedUsers.indexOf(targetUserId);
    if (index === -1) {
      user.blockedUsers.push(targetUserId);
      await user.save();
    }

    res.json({ success: true, message: 'User blocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Report User
exports.reportUser = async (req, res) => {
  try {
    const { targetUserId, reason } = req.body;
    const myId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    targetUser.reportedUsers.push({
      reporterId: myId,
      reason: reason || 'No reason provided'
    });

    await targetUser.save();
    res.json({ success: true, message: 'User reported' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    res.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
