'use strict';

const faker = require('faker');
const { Survey, Question, Response } = require('../models');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

module.exports = {
  up: async () => {
    try {
      const surveys = await Survey.findAll({ include: Question });
      const responses_per_survey_min = 1;
      const responses_per_survey_max = 3;
      let current_survey, questions, response_count;

      // Loop through all surveys
      for (let survey_i = 0; survey_i < surveys.length; survey_i++) {
        current_survey = surveys[survey_i];
        response_count = getRandomInt(
          responses_per_survey_min,
          responses_per_survey_max,
        );

        // Create a few Responses for each survey
        for (let response_i = 1; response_i <= response_count; response_i++) {
          let current_data = [],
            current_response;

          // Loop through the questions for the current_survey to add answers
          questions = current_survey.Questions;

          for (
            let question_i = 0;
            question_i < questions.length;
            question_i++
          ) {
            let current_question,
              current_answer = {};
            current_question = questions[question_i];
            switch (current_question.type) {
              case 'text':
              default:
                current_answer.value = faker.lorem.words();
                current_answer.id = current_question.id;
                break;
            }
            current_answer.type = current_question.type;
            current_data.push(current_answer);
          }

          // Attach the Response to the current survey
          current_response = await Response.create({
            userAgent: faker.internet.userAgent(),
            ipAddress: faker.internet.ip(),
            respondent: faker.name.findName(),
            data: current_data,
          });
          current_response.setSurvey(current_survey.id);
        }
      }
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.bulkDelete('Responses', null, {
        truncate: true,
        cascade: true,
      });
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  },
};
