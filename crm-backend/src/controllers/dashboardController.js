const User = require('../models/userModel');
const Lead = require('../models/leadModel');

exports.getStats = async (req, res) => {
  try {
    // Replace with real DB queries if needed
    // const totalUsers = await User.countDocuments();
    // const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
    // const leads = await Lead.find();
    // const leadsByStatus = leads.reduce((acc, lead) => {
    //   acc[lead.status] = (acc[lead.status] || 0) + 1;
    //   return acc;
    // }, {});

    // Mock data for now
    const totalUsers = 123;
    const activeLeads = 45;
    const leadsByStatus = {
      new: 10,
      contacted: 20,
      qualified: 8,
      closed: 7
    };

    res.json({
      totalUsers,
      activeLeads,
      leadsByStatus
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

exports.getRecentActivity = async (req, res) => {
  // Mock data for now
  const activities = [
    { id: 1, action: 'Created new Head Admin: Jane Doe', time: '2 hours ago', status: 'success' },
    { id: 2, action: 'System Backup Initiated', time: 'Yesterday', status: 'info' },
    { id: 3, action: 'Resolved Ticket #1234', time: '2 days ago', status: 'success' },
    { id: 4, action: 'User account deactivated: John Smith', time: '3 days ago', status: 'warning' },
    { id: 5, action: 'Monthly Report Generated', time: 'Last week', status: 'success' },
  ];
  res.json({ activities });
}; 