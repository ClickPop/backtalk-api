'use strict';

module.exports = {
  up: async (queryInterface) => {
    const questions = await queryInterface.sequelize.query(
      `SELECT id FROM "Questions" WHERE type='select'`,
    );
    const options = [];
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < questions[0].length; i++) {
        options.push({
          text: `Option ${j}`,
          questionId: questions[0][i].id,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
        });
      }
    }

    return await queryInterface.bulkInsert('Options', options);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Questions', null, {
      truncate: true,
      cascade: true,
    });
  },
};
