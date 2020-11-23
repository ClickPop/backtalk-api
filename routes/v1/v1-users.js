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
const { compare } = require('ip6addr');
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

router.patch('/update', authenticate, async (req, res, next) => {
  const { email, name, password, newPassword } = req.body;
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return next({
        status: 404,
        errors: [
          {
            msg: 'Not found',
          },
        ],
      });
    }

    if (!compare(password, user.password)) {
      return next({
        status: 401,
        errors: [
          {
            msg: 'Unauthorized',
          },
        ],
      });
    }

    user.email = email || user.email;
    user.name = name || user.name;
    user.password = newPassword ? await hash(newPassword, 10) : user.password;

    await user.save();

    res.status(200).json({
      updated: {
        email: !!email,
        name: !!name,
        password: !!newPassword,
      },
      result: {
        id: user.id,
        email: user.email,
        name: user.name,
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
});

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
