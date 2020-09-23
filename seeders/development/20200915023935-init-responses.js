'use strict';

const { loremIpsum } = require('lorem-ipsum');

module.exports = {
  up: async (queryInterface) => {
    const questions = await queryInterface.sequelize.query(
      `SELECT id FROM "Questions"`,
    );
    const responses = [];
    for (let i = 0; i < 100; i++) {
      let question =
        questions[0][
          Math.floor(Math.random() * Math.random() * questions[0].length)
        ];
      responses.push({
        value: loremIpsum(),
        QuestionId: question.id,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      });
    }

    return await queryInterface.bulkInsert('Responses', responses);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Responses', null, {
      truncate: true,
      cascade: true,
    });
  },
};
