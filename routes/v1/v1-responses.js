require('dotenv').config();
const express = require('express');
const authenticate = require('../../middleware/authenticate');
const { Response, Survey } = require('../../models');
const router = express.Router();
const hashIds = require('../../helpers/hashIds');

router.post('/new', async (req, res, next) => {
  try {
    const { surveyId, responses, respondent } = req.body;
    const data = await Response.create({
      SurveyId: surveyId,
      data: responses,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      respondent,
    });
    res.status(200).json({
      created: true,
      result: data,
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
      include: [Response],
    });
    const responses = survey.Responses;
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
    const survey = await Survey.findOne({
      where: {
        UserId: req.user.id,
      },
      include: [{ model: Response, where: { id: id } }],
    });
    if (!survey) {
      return next({
        status: 401,
        errors: [
          {
            msg: 'Unauthorized',
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
