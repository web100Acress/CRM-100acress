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