const { checkAccessToken } = require('../helpers/jwt');

module.exports = async (req, _, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.includes('Bearer')
  ) {
    return next({
      status: 401,
      errors: [
        {
          msg: 'Unauthorized',
        },
      ],
    });
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next({
      status: 401,
      errors: [
        {
          msg: 'Unauthorized',
        },
      ],
    });
  }

  try {
    const auth = await checkAccessToken(token);
    req.user = auth.user;
    return next();
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
};
