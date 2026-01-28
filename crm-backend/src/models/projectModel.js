const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  project_url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: String,
  city: String,
  state: String,
  projectAddress: String,
  builderName: String,
  project_Status: String,
  mobileNumber: String,
  isHidden: {
    type: Boolean,
    default: false
  },
  // Add other project fields as needed
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
