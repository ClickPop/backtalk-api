'use strict';
const { Survey } = require('../models/survey');
const { Question } = require('../models/question');
const { sequelize } = require('../db/sequelize');
const queryInterface = sequelize.getQueryInterface();

module.exports = {
  up: async () => {
    // const shared_question = await Question.create({
    //   prompt: `Shared Question`,
    //   type: 'text',
    // });

    const surveys = await Survey.findAll();
    // await shared_question.addSurveys(surveys);
    let question;
    for (let i = 0; i < surveys.length; i++) {
      question = await Question.create({
        prompt: `Would you rather be Back or Talk?`,
        type: 'text',
      });
      surveys[i].addQuestion(question);
      question = null;
    }

    return true;
  },

  down: async () => {
    await queryInterface.bulkDelete('SurveyQuestions', null, {
      truncate: true,
      cascade: true,
    });
    await queryInterface.bulkDelete('Questions', null, {
      truncate: true,
      cascade: true,
    });
  },
};
