const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const {
  checkValidationResult,
  checkTitle,
  checkSurveyQuestions,
} = require('../../middleware/validate');

const { Survey } = require('../../models');

router.post(
  '/new',
  authenticate,
  [checkTitle, checkSurveyQuestions],
  checkValidationResult,
  async (req, res, next) => {
    try {
      let sanitizedSurvey = {
        title: req.body.title,
        description: req.body.description || null,
        Questions: req.body.questions,
        UserId: req.user.id,
      };
      const survey = await Survey.create(
        {
          ...sanitizedSurvey,
        },
        {
          include: [Survey.questions],
        },
      );
      let result = survey.toJSON();
      result = { ...result, questions: result.Questions };
      delete result.Questions;
      return res.status(200).json({
        created: true,
        result,
      });
    } catch (err) {
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
  },
);

router.get('/', authenticate, async (req, res, next) => {
  try {
    const surveys = await Survey.findAll({
      where: {
        UserId: req.user.id,
      },
      limit: req.query.count || 20,
      offset: req.query.offset || 0,
      include: [Survey.questions],
    });
    let results = surveys.map((survey) => {
      let json = survey.toJSON();
      json = { ...json, questions: json.Questions };
      delete json.Questions;
      return json;
    });
    res.status(200).json({
      results,
    });
  } catch (err) {
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
