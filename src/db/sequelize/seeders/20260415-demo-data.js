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

      // create the room for user1 and user2

      const rooms323 = [];
      rooms323.push({
        first_member_id: insertedUsers[0].id,
        second_member_id: insertedUsers[1].id,
        created_at: now,
        updated_at: now,
      });

      await queryInterface.bulkInsert('rooms', rooms323, { transaction });

      // Step 2: Fetch inserted users (to get IDs)
      const insertedRooms = await queryInterface.sequelize.query(
        `SELECT id FROM "rooms";`,
        { type: Sequelize.QueryTypes.SELECT, transaction },
      );

      const theRoom = insertedRooms[0];

      // Step 3: Create 5 messages per user

      const messages = [
        { from: 0, to: 1, content: { type: 'text', content: { text: 'Hi' } } },
        {
          from: 1,
          to: 0,
          content: { type: 'text', content: { text: 'Hello' } },
        },
        {
          from: 0,
          to: 1,
          content: { type: 'text', content: { text: 'How are you?' } },
        },
        {
          from: 1,
          to: 0,
          content: { type: 'text', content: { text: 'I am fine.' } },
        },
        {
          from: 0,
          to: 1,
          content: { type: 'text', content: { text: 'What about u?' } },
        },
        {
          from: 1,
          to: 0,
          content: { type: 'text', content: { text: 'All good.' } },
        },
        {
          from: 0,
          to: 1,
          content: { type: 'text', content: { text: 'I need a help?' } },
        },
        {
          from: 1,
          to: 0,
          content: { type: 'text', content: { text: 'Regarding what?' } },
        },
      ];

      for (let k = 1; k <= 1000; k++) {
        if (k % 2 == 1) {
          messages.push({
            from: 0,
            to: 1,
            content: { type: 'text', content: { text: `${k}` } },
          });
        } else {
          messages.push({
            from: 1,
            to: 0,
            content: { type: 'text', content: { text: `${k}` } },
          });
        }
      }

      const messageRecords = [];

      messages.forEach((msg) => {
        const { from, to, content } = msg;
        messageRecords.push({
          from_user_id: insertedUsers[from].id,
          room_id: theRoom.id,
          to_user_id: insertedUsers[to].id,
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
      await queryInterface.bulkDelete('rooms', null, {});
      // Then delete users
      await queryInterface.bulkDelete('users', null, {});
    });
  },
};
