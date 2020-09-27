'use strict';
const path = require('path');
const { Survey, Question } = require(path.resolve('models'));

module.exports = {
  up: async () => {
    const shared_question = await Question.create({
      prompt: `Shared Question`,
      type: 'text',
    });

    const surveys = await Survey.findAll();
    await shared_question.addSurveys(surveys);
    let question;
    for (let i = 0; i < surveys.length; i++) {
      question = await Question.create({
        prompt: `Random Question ${surveys[i].id}`,
        type: 'text',
      });
      surveys[i].addQuestion(question);
      question = null;
    }

    return true;
  },

  down: async (queryInterface) => {
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
