const express = require('express');
const { Op } = require('sequelize');
const hashIds = require('../../helpers/hashIds');
const authenticate = require('../../middleware/authenticate');
const isAdmin = require('../../middleware/isAdmin');
const { User } = require('../../models/user');
const { Survey } = require('../../models/survey');
const { Question } = require('../../models/question');
const { Response } = require('../../models/response');
const { Role } = require('../../models/role');
const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  router.get('/admin', authenticate, async (req, res) => {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const admin = await Role.findOne({
      where: {
        slug: 'admin',
      },
    });
    user.addRole(admin);

    res.json({ admin: true });
  });
}

router.get('/users', authenticate, isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      limit: req.query.count || 20,
      offset: req.query.offset || 0,
      include: [
        {
          model: Survey,
          attributes: {
            exclude: ['UserId'],
          },
          include: [
            {
              model: Question,
            },
            {
              model: Response,
            },
          ],
        },
      ],
    });

    return res.json({ results: users.map((user) => user.toJSON()) });
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      errors: [
        {
          msg: 'Server error',
        },
      ],
    });
  }
});

router.get('/surveys', authenticate, isAdmin, async (req, res, next) => {
  try {
    const surveys = await Survey.findAll({
      limit: req.query.count || 20,
      offset: req.query.offset || 0,
      where: {
        UserId: {
          [Op.ne]: null,
        },
      },
      attributes: {
        exclude: ['UserId'],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['passwordResetToken', 'passwordResetExpiry', 'password'],
          },
        },
        Question,
        Response,
      ],
    });
    let results = [];
    for (let survey of surveys) {
      results.push({
        hash: await hashIds.encode(survey.id),
        ...survey.toJSON(),
      });
    }

    return res.json({ results });
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      errors: [
        {
          msg: 'Server error',
        },
      ],
    });
  }
});

module.exports = router;
