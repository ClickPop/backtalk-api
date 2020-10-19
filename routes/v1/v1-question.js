require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Survey, Question } = require('../../models');

router.post('/', async (req, res, next) => {
  const { questions } = req.body;
  const data = [];
  for (let i = 0; i < questions.length; i++) {
    try {
      const { surveyId, question } = questions[i];
      const survey = await Survey.findOne({
        where: {
          id: surveyId,
        },
        include: [Question],
      });
      if (!survey) {
        return next({
          status: 404,
          errors: [
            {
              msg: 'Survey not found',
              location: 'body',
            },
          ],
        });
      }
      const existingSurvey = survey.Questions.find(
        (q) => q.prompt === question.prompt,
      );
      if (!existingSurvey) {
        const newQuestion = await survey.createQuestion(question);
        data.push({ surveyId: survey.id, question: newQuestion });
      } else {
        data.push({ surveyId: survey.id, question: existingSurvey });
      }
    } catch (err) {
      return next({
        status: 500,
        stack: err.stack ? err.stack : null,
        errors: [
          {
            err,
          },
        ],
      });
    }
  }
  return res.status(201).json({ results: data });
});

module.exports = router;
