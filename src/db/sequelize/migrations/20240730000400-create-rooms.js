'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE TYPE "room_type" AS ENUM ('self', 'group');`,
        { transaction },
      );

      // 1. Create rooms table
      await queryInterface.createTable(
        'rooms',
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

          type: {
            type: 'room_type',
            allowNull: false,
          },

          title: {
            type: Sequelize.STRING,
            allowNull: true,
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

      await queryInterface.addConstraint('rooms', {
        type: 'primary key',
        fields: ['user_id', 'sn'],
        name: 'pk_rooms',
        transaction,
      });

      await queryInterface.addColumn(
        'user_metadata',
        'next_room_sn',
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
        CREATE OR REPLACE FUNCTION generate_next_room_sn() RETURNS TRIGGER AS $$
        DECLARE
          next_sn BIGINT;
        BEGIN
          -- Fetch the next_sn from the user_metadata table where id = NEW.user_id
          SELECT next_room_sn INTO next_sn FROM user_metadata WHERE user_id = NEW.user_id FOR UPDATE;
    
          NEW.sn := next_sn;
    
          UPDATE user_metadata SET next_room_sn = next_room_sn + 1 where user_id = NEW.user_id;
    
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
        { transaction },
      );

      // Create the trigger
      await queryInterface.sequelize.query(
        `
        CREATE TRIGGER rooms_before_insert_generate_sn
        BEFORE INSERT ON "rooms"
        FOR EACH ROW
        EXECUTE FUNCTION generate_next_room_sn();
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
    DROP TRIGGER IF EXISTS rooms_before_insert_generate_sn ON "rooms";
  `,
        { transaction },
      );

      // Drop the trigger function
      await queryInterface.sequelize.query(
        `
    DROP FUNCTION IF EXISTS generate_next_room_sn();
  `,
        { transaction },
      );

      await queryInterface.removeColumn('user_metadata', 'next_room_sn', {
        transaction,
      });

      // Drop the table (this automatically removes constraints)
      await queryInterface.dropTable('rooms', { transaction });

      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "room_type";`, {
        transaction,
      });
    });
  },
};
