const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: process.env.AUTH_TIME,
  max: process.env.AUTH_LIMIT,
});

const surveyLimiter = rateLimit({
  windowMs: process.env.SURVEY_TIME,
  max: process.env.SURVEY_LIMIT,
});

router.use('/auth', authLimiter, require('./v1-auth'));
router.use('/users', authLimiter, require('./v1-users'));
router.use('/surveys', surveyLimiter, require('./v1-surveys.js'));
router.use('/responses', surveyLimiter, require('./v1-responses.js'));
router.use('/question', surveyLimiter, require('./v1-question'));

//eslint-disable-next-line
router.use((err, req, res, next) => {
  if (err.stack) console.error(err.stack);
  return res.status(err.status).json({ errors: err.errors });
});

module.exports = router;
