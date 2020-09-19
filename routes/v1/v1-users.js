const express = require('express');
const { User } = require('../../models');
const { hash } = require('bcryptjs');
const authenticate = require('../../middleware/authenticate');
const {
  checkEmail,
  checkName,
  checkPassword,
  checkValidationResult,
} = require('../../middleware/validate');
const router = express.Router();

router.post(
  '/register',
  [checkEmail, checkName, checkPassword],
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { email, name, password } = req.body;

      if (await User.findOne({ where: { email } })) {
        return next({
          status: 409,
          errors: [
            {
              msg: 'Email already exists',
              location: 'body',
              param: 'email',
            },
          ],
        });
      }

      const user = await User.create(
        {
          email,
          name,
          password: await hash(password, 10),
        },
        {},
      );

      return res.status(201).json({
        registered: true,
        users: {
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      next({
        status: 500,
        errors: [
          {
            msg: 'Server error',
          },
        ],
      });
    }
  },
);

router.delete('/delete', authenticate, async (req, res, next) => {
  try {
    User.destroy({
      where: {
        id: req.user.id,
      },
    });
    res.status(200).json({ deleted: true });
  } catch (error) {
    console.error(error);
    next({
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
