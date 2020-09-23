require('dotenv').config();
const express = require('express');
const authenticate = require('../../middleware/authenticate');
const { Response, Survey, Question } = require('../../models');
const router = express.Router();
const hashIds = require('../../helpers/hashIds');

router.post('/new', async (req, res, next) => {
  try {
    const { responses } = req.body;
    responses.forEach((response) => {
      response.renameProperty('questionId', 'QuestionId');
    });
    const data = await Response.bulkCreate(responses);
    data.forEach((response) => {
      response.renameProperty('questionId', 'QuestionId');
    });
    res.status(200).json({
      created: true,
      results: data,
    });
  } catch (err) {
    console.error(err);
    next({
      status: 500,
      stack: err,
      errors: [
        {
          msg: err.msg,
        },
      ],
    });
  }
});

router.get('/:surveyId', authenticate, async (req, res, next) => {
  try {
    const id = await hashIds.decode(req.params.surveyId)[0];
    if (!id) {
      return next({
        status: 404,
        errors: [
          {
            msg: 'Not Found',
            location: 'url',
          },
        ],
      });
    }
    const survey = await Survey.findOne({
      where: { id: id },
      include: [Question],
    });
    const questions = survey.Questions;
    const responses = [];
    for (const question of questions) {
      const resps = await question.getResponses();
      resps.forEach((resp) => responses.push(resp.toJSON()));
    }
    res.status(200).json({
      results: responses,
    });
  } catch (err) {
    console.error(err);
    next({
      status: 500,
      stack: err,
      errors: [
        {
          msg: err.msg,
        },
      ],
    });
  }
});

router.delete('/delete', authenticate, async (req, res, next) => {
  try {
    const id = req.body.responseId;
    if (!id) {
      return next({
        status: 404,
        errors: [
          {
            msg: 'Not Found',
            location: 'url',
          },
        ],
      });
    }
    const response = await Response.destroy({
      where: {
        id,
      },
    });
    if (response < 1) {
      return res.status(200).json({ deleted: false });
    }
    res.status(200).json({
      deleted: true,
    });
  } catch (err) {
    console.error(err);
    next({
      status: 500,
      stack: err,
      errors: [
        {
          msg: err.msg,
        },
      ],
    });
  }
});

module.exports = router;
