const { body, validationResult } = require('express-validator');

const checkValidationResult = (req, _, next) => {
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

module.exports = {
  checkValidationResult,
  checkEmail,
  checkName,
  checkPassword,
};
