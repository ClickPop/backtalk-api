'use strict';

module.exports = {
  up: async (queryInterface) => {
    const surveys = await queryInterface.sequelize.query(
      'SELECT id FROM "Surveys"',
    );
    const questions = [];
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < surveys[0].length; i++) {
        questions.push({
          prompt: `Random Question ${j}`,
          type: j % 2 === 0 ? 'select' : 'text',
          surveyId: surveys[0][i].id,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
        });
      }
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
