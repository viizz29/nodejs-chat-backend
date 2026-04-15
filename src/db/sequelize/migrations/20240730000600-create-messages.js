'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE TYPE "message_direction" AS ENUM ('in', 'out');`,
        { transaction },
      );

      // 1. Create messages table
      await queryInterface.createTable(
        'messages',
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
          sn: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },

          room_sn: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          second_party: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          direction: {
            type: 'message_direction',
            allowNull: false,
          },

          content: {
            type: Sequelize.JSON,
            allowNull: false,
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

      await queryInterface.addConstraint('messages', {
        type: 'primary key',
        fields: ['user_id', 'sn'],
        name: 'pk_messages',
        transaction,
      });

      // 2. Add composite foreign key: (user_id, room_sn) ? rooms(user_id, sn)
      await queryInterface.addConstraint('messages', {
        fields: ['user_id', 'room_sn'],
        type: 'foreign key',
        name: 'fk_room_of_messages',
        references: {
          table: 'rooms',
          fields: ['user_id', 'sn'],
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction,
      });

      await queryInterface.addColumn(
        'user_metadata',
        'next_message_sn',
        {
          allowNull: false,
          type: Sequelize.BIGINT,
          defaultValue: 1,
        },
        { transaction },
      );

      // create trigger for generating ids, sequentially
      await queryInterface.sequelize.query(
        `
        CREATE OR REPLACE FUNCTION generate_next_message_sn() RETURNS TRIGGER AS $$
        DECLARE
          next_sn BIGINT;
        BEGIN
          -- Fetch the next_sn from the user_metadata table where id = NEW.user_id
          SELECT next_message_sn INTO next_sn FROM user_metadata WHERE user_id = NEW.user_id FOR UPDATE;
    
          NEW.sn := next_sn;
    
          UPDATE user_metadata SET next_message_sn = next_message_sn + 1 where user_id = NEW.user_id;
    
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
        { transaction },
      );

      // Create the trigger
      await queryInterface.sequelize.query(
        `
        CREATE TRIGGER messages_before_insert_generate_sn
        BEFORE INSERT ON "messages"
        FOR EACH ROW
        EXECUTE FUNCTION generate_next_message_sn();
      `,
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Drop the trigger
      await queryInterface.sequelize.query(
        `
    DROP TRIGGER IF EXISTS messages_before_insert_generate_sn ON "messages";
  `,
        { transaction },
      );

      // Drop the trigger function
      await queryInterface.sequelize.query(
        `
    DROP FUNCTION IF EXISTS generate_next_message_sn();
  `,
        { transaction },
      );

      await queryInterface.removeColumn('user_metadata', 'next_message_sn', {
        transaction,
      });

      // Drop the table (this automatically removes constraints)
      await queryInterface.dropTable('messages', { transaction });

      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "message_direction";`,
        {
          transaction,
        },
      );
    });
  },
};
