require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const {
  checkValidationResult,
  checkTitle,
  checkSurveyQuestions,
} = require('../../middleware/validate');
const { User } = require('../../models/user');
const { Survey } = require('../../models/survey');
const { Question } = require('../../models/question');
const { Response } = require('../../models/response');
const hashIds = require('../../helpers/hashIds');

router.get('/getHash', async (req, res) => {
  const { num } = req.query;
  const hash = await hashIds.encode(num);
  res.json({ hash });
});

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
        respondent: req.body.respondent,
      };
      const survey = await Survey.create(
        {
          ...sanitizedSurvey,
        },
        {
          include: Question,
        },
      );
      let result = survey.toJSON().renameProperty('Questions', 'questions');
      const hash = await hashIds.encode(result.id);
      return res.status(200).json({
        created: true,
        result: { ...result, hash },
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
      limit: req.query.count || 20,
      offset: req.query.offset || 0,
      attributes: {
        exclude: ['UserId'],
      },
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
          attributes: ['id', 'email', 'name'],
        },
        Question,
        Response,
      ],
    });
    let results = [];
    for (let i = 0; i < surveys.length; i++) {
      results.push({
        ...surveys[i].toJSON().renameProperty('Questions', 'questions'),
        hash: await hashIds.encode(surveys[i].id),
      });
    }
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

router.get('/:hash', async (req, res, next) => {
  try {
    const id = await hashIds.decode(req.params.hash)[0];
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
        id,
      },
      include: [Question],
    });
    let result = survey.toJSON().renameProperty('Questions', 'questions');
    result = { ...result };
    res.status(200).json({
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
});

router.get('/share/:hash', async (req, res, next) => {
  try {
    const id = await hashIds.decode(req.params.hash)[0];
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
        id,
        isPublic: true,
      },
      include: [Question, Response],
    });
    if (!survey) {
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
    survey.Responses = survey.Responses.map((response) => response.public());
    res.status(200).json({
      survey,
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

router.patch('/update', authenticate, async (req, res, next) => {
  try {
    const id = req.body.surveyId;
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

    await Survey.update(
      {
        title: req.body.title,
        description: req.body.description,
        Questions: req.body.questions,
        respondent: req.body.respondent,
        isPublic: req.body.isPublic,
        friendlyNames: req.body.friendlyNames,
      },
      {
        where: {
          id,
          UserId: req.user.id,
        },
      },
    );

    const survey = await Survey.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
      include: [Question],
    });

    if (!survey) {
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

    let result = survey.toJSON().renameProperty('Questions', 'questions');
    result = { ...result };
    res.status(201).json({
      result,
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
    const id = req.body.surveyId;
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
    const survey = await Survey.destroy({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
        },
      ],
    });
    if (survey < 1) {
      return res.status(200).json({ deleted: false });
    }
    res.status(200).json({
      deleted: true,
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
