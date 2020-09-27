'use strict';

const faker = require('faker');
const { Survey, Question, Session, Response } = require('../models');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

module.exports = {
  up: async () => {
    try {
      const surveys = await Survey.findAll({ include: Question });
      const sessions_per_survey_min = 1;
      const sessions_per_survey_max = 3;
      let current_survey,
        current_session,
        questions,
        current_question,
        current_response,
        session_count;

      // Loop through all surveys
      for (let survey_i = 0; survey_i < surveys.length; survey_i++) {
        current_survey = surveys[survey_i];
        session_count = getRandomInt(
          sessions_per_survey_min,
          sessions_per_survey_max,
        );

        // Create a few sessions for each survey
        for (let session_i = 1; session_i <= session_count; session_i++) {
          current_session = await Session.create({
            userAgent: faker.internet.userAgent(),
            ipAddress: faker.internet.ip(),
            respondent: faker.name.findName(),
          });
          // Attach the session to the current survey
          await current_survey.addSession(current_session);

          // Loop through the questions for the current_survey to add answers
          questions = current_survey.Questions;
          for (
            let question_i = 0;
            question_i < questions.length;
            question_i++
          ) {
            current_question = questions[0];
            current_response = await Response.create({
              value: faker.lorem.words(),
            });

            await current_question.addResponse(current_response);
          }
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

      await queryInterface.bulkDelete('Sessions', null, {
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
