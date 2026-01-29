const mongoose = require('mongoose');

const activityContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['Article', 'News', 'Update', 'Announcement', 'Tutorial', 'Other'],
    default: 'Other'
  },
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
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    author: String,
    authorEmail: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityContent', activityContentSchema);
