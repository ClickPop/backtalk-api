// const { body, query, param, validationResult } = require('express-validator');
const { body, validationResult } = require('express-validator');

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
};

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      errors: errors.array(),
    });
  }
  next();
};

const checkTitle = body('title')
  .exists()
  .withMessage(messages.required('title'))
  .trim()
  .escape()
  .isString()
  .withMessage(messages.mismatch('title', 'string'));

module.exports = {
  checkValidationResult,
  checkTitle,
};
