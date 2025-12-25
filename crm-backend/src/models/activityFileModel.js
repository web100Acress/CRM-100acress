const mongoose = require('mongoose');

const activityFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: String,
  fileSize: Number,
  description: String,
  department: {
    type: String,
    required: true,
    enum: ['IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations']
  },
  sharedBy: {
    type: String,
    required: true
  },
  sharedByEmail: String,
  category: {
    type: String,
    enum: ['Document', 'Image', 'Video', 'Spreadsheet', 'Presentation', 'Other'],
    default: 'Other'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityFile', activityFileSchema);
