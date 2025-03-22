const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(db) {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await db.collection('users').insertOne({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '1234567890',
      password: hashedPassword,
      roles: [],
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