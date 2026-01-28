const mongoose = require('mongoose');

const activityDepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations'],
    unique: true
  },
  description: String,
  color: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  credentials: [{
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    userName: String,
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

module.exports = mongoose.model('ActivityDepartment', activityDepartmentSchema);
