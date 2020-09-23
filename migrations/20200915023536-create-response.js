'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Responses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: {
        type: Sequelize.STRING,
      },
      respondent: {
        type: Sequelize.STRING,
      },
      seeded: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // SessionId: {
      //   type: Sequelize.BIGINT,
      //   references: {
      //     model: 'Sessions',
      //     key: 'id',
      //   },
      //   onDelete: 'CASCADE',
      // },
      QuestionId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Questions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Responses');
  },
};
