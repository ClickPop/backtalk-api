'use strict';
const { loremIpsum } = require('lorem-ipsum');

module.exports = {
  up: async (queryInterface) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id from "Users"',
    );
    const surveys = [];

    for (let i = 0; i < 10; i++) {
      surveys.push({
        title: `Random Survey ${i}`,
        description: loremIpsum(),
        userId:
          users[0][Math.floor(Math.random() + Math.random() * users.length)].id,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      });
    }

    return await queryInterface.bulkInsert('Surveys', surveys);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Surveys', null, {
      truncate: true,
      cascade: true,
    });
  },
};
