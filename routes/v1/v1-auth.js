const express = require('express');
const { User } = require('../../models');
const { compare } = require('bcryptjs');
const {
  getAccessToken,
  getRefreshToken,
  checkRefreshToken,
} = require('../../helpers/jwt');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return next({
        status: 401,
        errors: [
          {
            msg: 'Invalid email or password',
            location: 'body',
          },
        ],
      });
    }

    const auth = await compare(req.body.password, user.password);
    if (!auth) {
      return next({
        status: 401,
        errors: [
          {
            msg: 'Invalid email or password',
            location: 'body',
          },
        ],
      });
    }

    const accessToken = await getAccessToken(user.id);
    const refreshToken = await getRefreshToken(user.id);

    return res
      .cookie('jrt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      })
      .status(200)
      .json({
        accessToken,
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

router.post('/refresh_token', async (req, res, next) => {
  try {
    const { jrt } = req.signedCookies;
    if (!jrt) {
      return next({
        status: 401,
        errors: [
          {
            msg: 'Missing refresh token',
          },
        ],
      });
    }

    const user = await checkRefreshToken(jrt);

    const accessToken = await getAccessToken(user.id);
    const refreshToken = await getRefreshToken(user.id);

    return res
      .cookie('jrt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      })
      .status(200)
      .json({
        accessToken,
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

module.exports = router;
