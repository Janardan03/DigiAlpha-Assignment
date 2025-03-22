module.exports = {
    async up(db) {
      // Create roles
      const adminRole = await db.collection('roles').insertOne({
        name: 'admin',
        permissions: [
          'create:user',
          'read:user',
          'read:users',
          'update:user',
          'delete:user',
          'create:role',
          'read:roles',
          'assign:roles'
        ],
        description: 'Administrator with full access',
        createdAt: new Date()
      });
      
      const userRole = await db.collection('roles').insertOne({
        name: 'user',
        permissions: [
          'read:own-profile',
          'update:own-profile'
        ],
        description: 'Regular user with limited access',
        createdAt: new Date()
      });
      
      const adminUser = await db.collection('users').findOne({ email: 'admin@example.com' });
      if (adminUser) {
        await db.collection('users').updateOne(
          { _id: adminUser._id },
          { $set: { roles: [adminRole.insertedId] } }
        );
      }
      
      console.log('Created roles and assigned admin role to admin user');
    },
  
    async down(db) {
      await db.collection('roles').deleteMany({ name: { $in: ['admin', 'user'] } });
      console.log('Removed roles');
    }
  };