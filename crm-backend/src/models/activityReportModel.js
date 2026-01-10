const mongoose = require('mongoose');

const activityReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  content: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations']
  },
  submittedBy: {
    type: String,
    required: true
  },
  submittedByEmail: String,
  reportType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Custom'],
    default: 'Custom'
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Reviewed', 'Approved'],
    default: 'Submitted'
  },
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityReport', activityReportSchema);
