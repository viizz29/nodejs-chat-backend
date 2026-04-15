'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Create room_members table
      await queryInterface.createTable(
        'room_members',
        {
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          room_sn: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          member_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          is_approved: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          is_blocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },

          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint('room_members', {
        type: 'primary key',
        fields: ['user_id', 'room_sn', 'member_id'],
        name: 'pk_room_members',
        transaction,
      });

      // 2. Add composite foreign key: (user_id, room_sn) ? journal_entries(user_id, sn)
      await queryInterface.addConstraint('room_members', {
        fields: ['user_id', 'room_sn'],
        type: 'foreign key',
        name: 'fk_room_of_room_members',
        references: {
          table: 'rooms',
          fields: ['user_id', 'sn'],
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Drop the table (this automatically removes constraints)
      await queryInterface.dropTable('room_members', { transaction });
    });
  },
};
