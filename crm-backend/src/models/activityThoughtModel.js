const mongoose = require('mongoose');

const activityThoughtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  thought: {
    type: String,
    required: true
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
  category: {
    type: String,
    enum: ['Idea', 'Suggestion', 'Feedback', 'Discussion', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  likes: {
    type: Number,
    default: 0
  },
  replies: [{
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

module.exports = mongoose.model('ActivityThought', activityThoughtSchema);
