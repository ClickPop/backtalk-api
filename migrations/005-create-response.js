'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Responses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      data: {
        type: Sequelize.JSONB,
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
      SurveyId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Surveys',
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
