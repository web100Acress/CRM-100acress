const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { mapAcressRoleToCRM } = require('./roleMappingService');

const createUser = async (userData) => {
  // Apply role mapping if role is provided
  if (userData.role) {
    userData.role = mapAcressRoleToCRM(userData.role);
    console.log(' User Creation Role Mapping:', {
      originalRole: userData.role,
      mappedRole: userData.role
    });
  }
  
  if (userData.password) {
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  }
  return await User.create(userData);
};

const getUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, updateData) => {
  // Apply role mapping if role is being updated
  if (updateData.role) {
    updateData.role = mapAcressRoleToCRM(updateData.role);
    console.log(' User Update Role Mapping:', {
      originalRole: updateData.role,
      mappedRole: updateData.role
    });
  }
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const setResetToken = async (email) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 3600000; // 1 hour
  const user = await User.findOneAndUpdate(
    { email },
    { resetPasswordToken: token, resetPasswordExpires: expires },
    { new: true }
  );
  return { user, token };
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return null;
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return user;
};

const updateUserStatus = async (id, status) => {
  return await User.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true, runValidators: true }
  );
};

const updateProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId, 
    updateData, 
    { new: true, runValidators: true }
  );
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setResetToken,
  resetPassword,
  updateUserStatus,
  updateProfile
};