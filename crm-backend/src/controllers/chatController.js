const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Lead = require('../models/leadModel');

// 🎯 WhatsApp Style Chat System - STRICT: Only Assigner ↔ Assigned User
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
    if (createdBy === assignedTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Self assignment not allowed' 
      });
    }

    // 🔒 VALIDATE: Both users must be in assignment chain and form a consecutive pair
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
    
    // Log for debugging
    console.log('🔍 CHAT VALIDATION DEBUG:', {
      leadId,
      createdBy,
      assignedTo,
      leadAssignedTo: lead.assignedTo,
      leadAssignedBy: lead.assignedBy,
      assignmentChainLength: assignmentChain.length,
      createdByInChain,
      assignedToInChain,
      isCreatedByCurrentAssigned,
      isAssignedToCurrentAssigned,
      isCreatedByAssignedBy,
      isAssignedToAssignedBy,
      assignmentChain: assignmentChain.map(e => ({
        userId: e.userId,
        name: e.name,
        role: e.role,
        assignedBy: e.assignedBy
      }))
    });
    
    // Both users must be in chain or currently assigned/assignedBy
    if (!(createdByInChain || isCreatedByCurrentAssigned || isCreatedByAssignedBy) || 
        !(assignedToInChain || isAssignedToCurrentAssigned || isAssignedToAssignedBy)) {
      console.log('❌ VALIDATION FAILED: Users not in assignment chain');
      return res.status(403).json({ 
        success: false, 
        message: 'Chat not allowed: Both users must be in the assignment chain.' 
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
        // createdBy is the assigner of assignedTo
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
          // assignedTo is the assigner of createdBy
          isValidPair = true;
          console.log('✅ Case 2: assignedTo is assigner of createdBy');
        }
      }
    }
    
    // Case 3: Direct assignment check (lead.assignedBy → lead.assignedTo)
    if (!isValidPair) {
      if (isCreatedByAssignedBy && isAssignedToCurrentAssigned) {
        // createdBy is the assigner (lead.assignedBy) and assignedTo is the assigned (lead.assignedTo)
        isValidPair = true;
        console.log('✅ Case 3: Direct assignment (assignedBy → assignedTo)');
      } else if (isAssignedToAssignedBy && isCreatedByCurrentAssigned) {
        // assignedTo is the assigner and createdBy is the assigned
        isValidPair = true;
        console.log('✅ Case 3b: Reverse direct assignment (assignedTo → createdBy)');
      }
    }
    
    // Case 4: Both are in chain and could be consecutive (check all pairs)
    if (!isValidPair && createdByInChain && assignedToInChain) {
      // Check if they appear as consecutive assigner-assigned pairs
      for (const entry of assignmentChain) {
        const assignerId = getAssignerId(entry);
        const entryUserId = String(entry.userId);
        
        // Check if createdBy assigned to assignedTo
        if (assignerId && String(assignerId) === String(createdBy) && entryUserId === String(assignedTo)) {
          isValidPair = true;
          console.log('✅ Case 4: Found consecutive pair in chain (createdBy → assignedTo)');
          break;
        }
        
        // Check if assignedTo assigned to createdBy
        if (assignerId && String(assignerId) === String(assignedTo) && entryUserId === String(createdBy)) {
          isValidPair = true;
          console.log('✅ Case 4b: Found consecutive pair in chain (assignedTo → createdBy)');
          break;
        }
      }
    }
    
    // Case 5: Check consecutive entries in chain (user at index i assigned to user at index i+1)
    if (!isValidPair && assignmentChain.length >= 2) {
      for (let i = 0; i < assignmentChain.length - 1; i++) {
        const currentEntry = assignmentChain[i];
        const nextEntry = assignmentChain[i + 1];
        const currentUserIdStr = String(currentEntry.userId);
        const nextUserIdStr = String(nextEntry.userId);
        
        // Check if createdBy and assignedTo are consecutive in chain
        if ((currentUserIdStr === String(createdBy) && nextUserIdStr === String(assignedTo)) ||
            (currentUserIdStr === String(assignedTo) && nextUserIdStr === String(createdBy))) {
          isValidPair = true;
          console.log('✅ Case 5: Users are consecutive in assignment chain');
          break;
        }
      }
    }
    
    if (!isValidPair) {
      console.log('❌ VALIDATION FAILED: Users do not form a valid consecutive pair');
      console.log('Assignment chain details:', JSON.stringify(assignmentChain, null, 2));
      return res.status(403).json({ 
        success: false, 
        message: 'Chat not allowed: Users must be consecutive pairs in the assignment chain (assigner ↔ assigned user).',
        debug: {
          createdBy,
          assignedTo,
          assignmentChainLength: assignmentChain.length,
          createdByInChain,
          assignedToInChain
        }
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      leadId,
      participants: { $all: [createdBy, assignedTo] }
    }).populate('participants', 'name role email')
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
      await chat.populate('participants', 'name role email');
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
    .populate('participants', 'name role email')
    .populate('leadId', 'name email phone status')
    .sort({ updatedAt: -1 });

    // Format for frontend
    const formattedChats = chats.map(chat => {
      const oppositeUser = chat.participants.find(u => u._id.toString() !== currentUserId);
      const unreadCount = chat.unreadCount.get(currentUserId) || 0;
      
      return {
        _id: chat._id,
        leadId: chat.leadId,
        participants: chat.participants,
        oppositeUser: {
          _id: oppositeUser?._id,
          name: oppositeUser?.name,
          role: oppositeUser?.role,
          email: oppositeUser?.email
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
