'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'user_metadata',
        {
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'users',
              key: 'id',
            },
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('user_metadata', { transaction });
    });
  },
};
