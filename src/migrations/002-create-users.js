const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = {
  async up(db) {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminRole = await db.collection('roles').findOne({ name: 'admin' });

    if (!adminRole) {
      console.error("Admin role not found in the database!");
      return;
    }
    
    await db.collection('users').insertOne({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '1234567890',
      password: hashedPassword,
      roles: [adminRole._id],
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('Created admin user');
  },

  async down(db) {
    await db.collection('users').deleteOne({ email: 'admin@example.com' });
    console.log('Removed admin user');
  }
};