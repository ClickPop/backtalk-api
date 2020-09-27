'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SurveyQuestions', {
      SurveyId: {
        type: Sequelize.BIGINT,
        defaultValue: null,
        references: {
          model: 'Surveys',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      QuestionId: {
        type: Sequelize.BIGINT,
        defaultValue: null,
        references: {
          model: 'Questions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('SurveyQuestions');
  },
};
