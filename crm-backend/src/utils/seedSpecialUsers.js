const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Aman Developer',
    email: 'amandev@gmail.com',
    password: 'dev123',
    role: 'developer',
    department: 'engineering'
  },
  {
    name: 'HR/Finance User',
    email: 'amanhr@gmail.com',
    password: 'hr123',
    role: 'hr_finance',
    department: 'hr'
  },
  {
    name: 'IT Team Lead',
    email: 'amanit@gmail.com',
    password: 'it123',
    role: 'it_infrastructure',
    department: 'it'
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/100acres'); // Update with your DB URI if needed
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
    await User.updateOne({ email: user.email }, user, { upsert: true });
    console.log(`Upserted: ${user.email}`);
  }
  mongoose.disconnect();
}

seed();

async function updateRole() {
  await mongoose.connect('mongodb://localhost:27017/100acres'); // Update with your DB URI if needed
  const email = 'vinay.aadharhomes@gmail.com';
  const result = await User.updateOne({ email }, { $set: { role: 'developer' } });
  console.log(`Updated role for ${email} to developer. Result:`, result);
  mongoose.disconnect();
}

updateRole();

async function updatePasswordAndRole() {
  await mongoose.connect('mongodb://localhost:27017/100acres'); // Update with your DB URI if needed
  const email = 'vinay.aadharhomes@gmail.com';
  const newPassword = '1234567890'; // Set your desired password here
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await User.updateOne(
    { email },
    { $set: { password: hashedPassword, role: 'developer' } }
  );
  console.log(`Updated password and role for ${email}. Result:`, result);
  mongoose.disconnect();
}

updatePasswordAndRole(); 