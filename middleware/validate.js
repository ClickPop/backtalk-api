const { body, validationResult } = require('express-validator');
const allowedQuestionTypes = ['text'];

const messages = {
  mismatch: (name, type) => {
    return `${name}: Type mismatch, expected: ${type.toUpperCase()}*.`;
  },
  required: (name) => {
    return `${name}: Missing required parameter.`;
  },
  format: (name) => {
    return `${name}: Formatted incorrectly.`;
  },
  value: (name, value) => {
    if (Array.isArray(value)) {
      value = `[${value.join(', ')}]`;
    } else if (typeof value === 'string') {
      value = value.trim();
    } else {
      value = value.toString();
    }

    return `${name}: Incorrect value, expected: ${value}`;
  },
};

const checkValidationResult = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      errors: errors.array(),
    });
  }
  return next();
};

const checkEmail = body('email')
  .exists()
  .withMessage('Email is required')
  .trim()
  .escape()
  .isString()
  .withMessage('Incorrect data type')
  .isEmail()
  .withMessage('Email must be formatted correctly');

const checkName = body('name')
  .exists()
  .withMessage('Name is required.')
  .trim()
  .escape()
  .isString()
  .withMessage('Incorrect data type.');

const checkPassword = body('password')
  .exists()
  .withMessage('Password is required')
  .trim()
  .escape()
  .isString()
  .withMessage('Incorrect data type.')
  .custom((password) => password.length >= 8 && password.length <= 32)
  .withMessage('Password must be at least 8 characters')
  .custom((password) => {
    let regex = /[a-z]/;
    return regex.test(password);
  })
  .withMessage('Password must include at least one lowercase letter')
  .custom((password) => {
    let regex = /[A-Z]/;
    return regex.test(password);
  })
  .withMessage('Password must include at least one uppercase letter')
  .custom((password) => {
    let regex = /[0-9]/;
    return regex.test(password);
  })
  .withMessage('Password must include at least one number')
  .custom((password) => {
    let regex = /[!@#$%^&*()-_=+{}[\];:'",<.>/?\\|]/;
    return regex.test(password);
  })
  .withMessage('Password must include at least one special character');

const checkTitle = body('title')
  .exists()
  .withMessage(messages.required('title'))
  .trim()
  .escape()
  .isString()
  .withMessage(messages.mismatch('title', 'string'));

const checkSurveyQuestions = [
  body('questions')
    .exists()
    .withMessage(messages.required('questions'))
    .isArray({ min: 1 })
    .withMessage(messages.mismatch('questions', 'array')),
  body('questions.*.prompt')
    .exists()
    .withMessage(messages.required('question.prompt'))
    .trim()
    .escape()
    .isString()
    .withMessage(messages.mismatch('question.prompt', 'string')),
  body('questions.*.description')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage(messages.mismatch('question.description', 'string')),
  body('questions.*.type')
    .exists()
    .withMessage(messages.required('question.type'))
    .trim()
    .escape()
    .isString()
    .withMessage(messages.mismatch('question.type', 'string'))
    .custom((value) => {
      return value === 'text';
    })
    .withMessage(messages.value('question.type', allowedQuestionTypes)),
];

module.exports = {
  checkValidationResult,
  checkEmail,
  checkName,
  checkPassword,
  checkTitle,
  checkSurveyQuestions,
};
