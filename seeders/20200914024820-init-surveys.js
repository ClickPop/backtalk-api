'use strict';
const { loremIpsum } = require('lorem-ipsum');
const { Survey, User } = require('../models');
module.exports = {
  up: async () => {
    const surveys = [];
    const users = await User.findAll();

    for (let i = 0; i < 10; i++) {
      let survey = await Survey.create({
        title: `Random Survey ${i}`,
        description: loremIpsum(),
        respondent: true,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      });
      survey.setUser(users[Math.floor(Math.random() * users.length)]);
      surveys.push(survey);
      survey = undefined;
    }

    return true;
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Surveys', null, {
      truncate: true,
      cascade: true,
    });
  },
};
