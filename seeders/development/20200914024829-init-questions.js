'use strict';

module.exports = {
  up: async (queryInterface) => {
    const surveys = await queryInterface.sequelize.query(
      'SELECT id FROM "Surveys"',
    );
    const questions = [];
    for (let i = 0; i < surveys[0].length; i++) {
      questions.push({
        prompt: `Random Question ${i + 1}`,
        type: 'text',
        SurveyId: surveys[0][i].id,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      });
    }

    return await queryInterface.bulkInsert('Questions', questions);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Questions', null, {
      truncate: true,
      cascade: true,
    });
  },
};
