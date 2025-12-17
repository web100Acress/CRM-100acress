const ActivityDepartment = require('../models/activityDepartmentModel');
const ActivityReport = require('../models/activityReportModel');
const ActivityFile = require('../models/activityFileModel');
const ActivityContent = require('../models/activityContentModel');
const ActivityThought = require('../models/activityThoughtModel');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../services/emailService');

// Create Activity Department with credentials (or add credentials to existing department)
exports.createActivityDepartment = async (req, res) => {
  try {
    const { name, email, password, description, color, userName } = req.body;
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if department already exists
    let department = await ActivityDepartment.findOne({ name });
    
    if (department) {
      // Department exists - add new credentials to it
      // Check if email already exists in credentials
      const emailExists = department.credentials.some(cred => cred.email === email);
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already exists for this department' });
      }

      // Add new credentials
      department.credentials.push({
        email,
        password: hashedPassword,
        userName: userName || email.split('@')[0]
      });

      await department.save();

      res.status(200).json({
        success: true,
        message: 'New credentials added to department successfully',
        data: {
          id: department._id,
          name: department.name,
          description: department.description,
          color: department.color,
          credentialsCount: department.credentials.length
        }
      });
    } else {
      // Create new department with first credentials
      department = new ActivityDepartment({
        name,
        description,
        color: color || '#3B82F6',
        createdBy: userId,
        credentials: [{
          email,
          password: hashedPassword,
          userName: userName || email.split('@')[0]
        }]
      });

      await department.save();

      res.status(201).json({
        success: true,
        message: 'Activity Department created successfully',
        data: {
          id: department._id,
          name: department.name,
          description: department.description,
          color: department.color,
          credentialsCount: 1
        }
      });
    }

    // Send credentials email
    const emailSubject = `Activity Department Credentials - ${name}`;
    const emailHtml = `
      <h2>Welcome to ${name} Department</h2>
      <p>Your Activity Department credentials have been created.</p>
      <p><strong>Department:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>You can now login to the Activity Dashboard with these credentials.</p>
      <p><strong>Login URL:</strong> https://crm.100acress.com/login</p>
    `;

    sendMail(email, emailSubject, '', emailHtml).catch((error) => {
      console.log('Email error:', error);
    });

  } catch (error) {
    console.error('Error creating activity department:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Activity Departments
exports.getAllActivityDepartments = async (req, res) => {
  try {
    const departments = await ActivityDepartment.find()
      .select('-credentials.password')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Report
exports.submitReport = async (req, res) => {
  try {
    const { title, description, content, department, submittedBy, submittedByEmail, reportType } = req.body;

    const report = new ActivityReport({
      title,
      description,
      content,
      department,
      submittedBy,
      submittedByEmail,
      reportType,
      status: 'Submitted'
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Reports (visible to all departments)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await ActivityReport.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Reports by Department
exports.getReportsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const reports = await ActivityReport.find({ department }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Share File
exports.shareFile = async (req, res) => {
  try {
    const { fileName, fileUrl, fileType, fileSize, description, department, sharedBy, sharedByEmail, category, tags } = req.body;

    const file = new ActivityFile({
      fileName,
      fileUrl,
      fileType,
      fileSize,
      description,
      department,
      sharedBy,
      sharedByEmail,
      category,
      tags: tags || []
    });

    await file.save();

    res.status(201).json({
      success: true,
      message: 'File shared successfully',
      data: file
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Files (visible to all departments)
exports.getAllFiles = async (req, res) => {
  try {
    const files = await ActivityFile.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Files by Department
exports.getFilesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const files = await ActivityFile.find({ department }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Share Content
exports.shareContent = async (req, res) => {
  try {
    const { title, content, contentType, department, sharedBy, sharedByEmail, tags } = req.body;

    const activityContent = new ActivityContent({
      title,
      content,
      contentType,
      department,
      sharedBy,
      sharedByEmail,
      tags: tags || []
    });

    await activityContent.save();

    res.status(201).json({
      success: true,
      message: 'Content shared successfully',
      data: activityContent
    });
  } catch (error) {
    console.error('Error sharing content:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Content (visible to all departments)
exports.getAllContent = async (req, res) => {
  try {
    const contents = await ActivityContent.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contents
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Content by Department
exports.getContentByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const contents = await ActivityContent.find({ department }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contents
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment to content
exports.addCommentToContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { author, authorEmail, text } = req.body;

    const content = await ActivityContent.findByIdAndUpdate(
      contentId,
      {
        $push: {
          comments: {
            author,
            authorEmail,
            text,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: content
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Share Thought
exports.shareThought = async (req, res) => {
  try {
    const { title, thought, department, sharedBy, sharedByEmail, category, priority } = req.body;

    const activityThought = new ActivityThought({
      title,
      thought,
      department,
      sharedBy,
      sharedByEmail,
      category,
      priority
    });

    await activityThought.save();

    res.status(201).json({
      success: true,
      message: 'Thought shared successfully',
      data: activityThought
    });
  } catch (error) {
    console.error('Error sharing thought:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Thoughts (visible to all departments)
exports.getAllThoughts = async (req, res) => {
  try {
    const thoughts = await ActivityThought.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: thoughts
    });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Thoughts by Department
exports.getThoughtsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const thoughts = await ActivityThought.find({ department }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: thoughts
    });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add reply to thought
exports.addReplyToThought = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { author, authorEmail, text } = req.body;

    const thought = await ActivityThought.findByIdAndUpdate(
      thoughtId,
      {
        $push: {
          replies: {
            author,
            authorEmail,
            text,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: thought
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like content
exports.likeContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await ActivityContent.findByIdAndUpdate(
      contentId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Content liked',
      data: content
    });
  } catch (error) {
    console.error('Error liking content:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like thought
exports.likeThought = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await ActivityThought.findByIdAndUpdate(
      thoughtId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Thought liked',
      data: thought
    });
  } catch (error) {
    console.error('Error liking thought:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if email exists in Activity departments
exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('Checking if email exists in Activity departments:', email);

    // Find department that has this email in credentials
    const department = await ActivityDepartment.findOne({
      'credentials.email': email
    });

    console.log('Email exists check result:', department ? 'Found' : 'Not found');

    res.status(200).json({
      success: true,
      exists: !!department
    });
  } catch (error) {
    console.error('Error checking email existence:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Activity Department Login - Search across all departments for matching credentials
exports.activityDepartmentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    // Find department that has this email in credentials
    const department = await ActivityDepartment.findOne({
      'credentials.email': email
    });

    console.log('Found department:', department ? department.name : 'None');

    if (!department) {
      console.log('No department found for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Find the specific credential
    const credential = department.credentials.find(cred => cred.email === email);
    if (!credential) {
      console.log('No credential found for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('Found credential for user:', credential.userName);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, credential.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('Login successful for:', email, 'Department:', department.name);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: department._id,
        name: department.name,
        email: credential.email,
        userName: credential.userName,
        description: department.description,
        color: department.color
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
