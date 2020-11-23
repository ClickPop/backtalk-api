const express = require('express');
const { User } = require('../../models');
const { compare, hash } = require('bcryptjs');
const crypto = require('crypto');
const {
  getAccessToken,
  getRefreshToken,
  checkRefreshToken,
} = require('../../helpers/jwt');
const {
  checkEmail,
  checkPassword,
  checkValidationResult,
} = require('../../middleware/validate');
const { add, compareAsc } = require('date-fns');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post(
  '/login',
  [checkEmail, checkPassword],
  checkValidationResult,
  async (req, res, next) => {
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
  },
);

router.post('/logout', async (req, res, next) => {
  try {
    return res.clearCookie('jrt').status(200).json({
      logout: true,
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

    const auth = await checkRefreshToken(jrt);
    const accessToken = await getAccessToken(auth.user.id);
    const refreshToken = await getRefreshToken(auth.user.id);

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

router.post('/reset-challenge', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
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

    const resetExpiry = add(new Date(), {
      minutes: process.env.PASSWORD_RESET_EXPIRY,
    });
    const token = crypto.randomBytes(16).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpiry = resetExpiry;
    await user.save();

    const mailData = {};
    if (process.env.NODE_ENV !== 'production') {
      let testAccount = await nodemailer.createTestAccount();

      mailData.host = 'smtp.ethereal.email';
      mailData.port = 587;
      mailData.secure = false;
      mailData.auth = {
        user: testAccount.user,
        pass: testAccount.pass,
      };
    } else {
      mailData.host = process.env.MAIL_HOST;
      mailData.port = 465;
      mailData.secure = true;
      mailData.auth = {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      };
    }

    const transport = nodemailer.createTransport(mailData);

    const mail = await transport.sendMail({
      from: 'chris@clickpopmedia.com',
      to: email,
      subject: 'Backtalk Password Reset',
      text: `
        Hey there ${user.name.split(' ')[0]},

        Sorry to hear about your password. We all forget stuff from time to time.

        Just click on this link and we can get you back up and running in no time! :)

        ${process.env.RESET_EMAIL_URL}${token}
      `,
      html: `
        Hey there ${user.name.split(' ')[0]},

        Sorry to hear about your password. We all forget stuff from time to time.

        Just click on <a href="${
          process.env.RESET_EMAIL_URL
        }${token}" target="_blank">this link</a> and we can get you back up and running in no time! :)
      `,
    });

    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        url: nodemailer.getTestMessageUrl(mail),
        token,
      });
    }

    return res.status(200).json({
      resetStarted: true,
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

router.post('/reset-password', async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
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

    if (compareAsc(user.passwordResetExpiry, new Date()) !== 1) {
      return next({
        status: 422,
        errors: [
          {
            msg: 'Reset Token Expired',
          },
        ],
      });
    }

    if (await compare(password, user.password)) {
      return next({
        status: 422,
        errors: [
          {
            msg: 'Password is the same as the old one',
          },
        ],
      });
    }

    user.password = await hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();

    return res.status(200).json({
      passwordReset: true,
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
