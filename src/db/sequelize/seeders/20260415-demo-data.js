'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Create 5 users
      const users = Array.from({ length: 5 }).map((_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password:
          '$2b$10$KiAcpDEwGrA9eZoqouDRz.do8oWxu7brPs.Py7WbQl9cX/CDTtWD6', // password123
        created_at: now,
        updated_at: now,
      }));

      // Insert users
      await queryInterface.bulkInsert('users', users, { transaction });

      // Step 2: Fetch inserted users (to get IDs)
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id FROM "users";`,
        { type: Sequelize.QueryTypes.SELECT, transaction },
      );

      // create the user_metadata records
      const userMetadataRecords = [];
      insertedUsers.forEach((user) => {
        userMetadataRecords.push({
          user_id: user.id,
          created_at: now,
          updated_at: now,
        });
      });
      await queryInterface.bulkInsert('user_metadata', userMetadataRecords, {
        transaction,
      });

      // create the 'self' room corresponding to each user

      const selfRooms = [];
      for (const user of insertedUsers) {
        selfRooms.push({
          user_id: user.id,
          sn: 1n,
          type: 'self',
          created_at: now,
          updated_at: now,
        });
      }

      await queryInterface.bulkInsert('rooms', selfRooms, { transaction });

      const groups = [];
      for (const user of insertedUsers) {
        for (let i = 0; i < 2; i++) {
          groups.push({
            user_id: user.id,
            sn: 1n,
            type: 'group',
            title: `Group${i + 1}`,
            created_at: now,
            updated_at: now,
          });
        }
      }
      await queryInterface.bulkInsert('rooms', groups, { transaction });

      // connect user1 and user2 with each other
      await queryInterface.bulkInsert(
        'room_members',
        [
          {
            user_id: insertedUsers[0].id,
            room_sn: 1,
            member_id: insertedUsers[1].id,
            is_approved: true,
            created_at: now,
            updated_at: now,
          },
          {
            user_id: insertedUsers[1].id,
            room_sn: 1,
            member_id: insertedUsers[0].id,
            is_approved: true,
            created_at: now,
            updated_at: now,
          },
        ],
        { transaction },
      );

      // Step 3: Create 5 messages per user

      const messages = [
        { from: 0, to: 1, content: { type: 'text', content: 'Hi' } },
        { from: 1, to: 0, content: { type: 'text', content: 'Hello' } },
        { from: 0, to: 1, content: { type: 'text', content: 'How are you?' } },
        { from: 1, to: 0, content: { type: 'text', content: 'I am fine.' } },
        { from: 0, to: 1, content: { type: 'text', content: 'What about u?' } },
        { from: 1, to: 0, content: { type: 'text', content: 'All good.' } },
      ];

      const messageRecords = [];

      messages.forEach((msg) => {
        const { from, to, content } = msg;
        messageRecords.push({
          user_id: insertedUsers[from].id,
          sn: 1,
          room_sn: 1,
          second_party: insertedUsers[to].id,
          direction: 'out',
          content: JSON.stringify(content),
          created_at: now,
          updated_at: now,
        });

        messageRecords.push({
          user_id: insertedUsers[to].id,
          sn: 1,
          room_sn: 1,
          second_party: insertedUsers[from].id,
          direction: 'in',
          content: JSON.stringify(content),
          created_at: now,
          updated_at: now,
        });
      });

      // Insert messages
      await queryInterface.bulkInsert('messages', messageRecords, {
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Delete all messages first (due to FK constraint)
      await queryInterface.bulkDelete('messages', null, {});

      await queryInterface.bulkDelete('room_members', null, {});

      await queryInterface.bulkDelete('rooms', null, {});

      // Then delete users
      await queryInterface.bulkDelete('Users', null, {});
    });
  },
};
