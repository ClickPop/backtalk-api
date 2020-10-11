require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Survey } = require('../../models');

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
      const newQuestion = await survey.createQuestion(question);
      data.push({ surveyId: survey.id, question: newQuestion });
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
  return res.status(201).json(data);
});

module.exports = router;
