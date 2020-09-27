'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      SurveyId: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
      },
      userAgent: {
        type: Sequelize.STRING,
      },
      ipAddress: {
        type: Sequelize.INET,
      },
      respondent: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Sessions');
  },
};
