const Meeting = require('../models/meetingModel');

// Socket.IO instance will be set from server.js
let io = null;
exports.setSocketIO = (ioInstance) => { io = ioInstance; };

exports.createMeeting = async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const meeting = await Meeting.create({ title, date, description });
    if (io) {
      io.emit('meetingScheduled', meeting);
    }
    res.status(201).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 });
    res.json({ success: true, data: meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 