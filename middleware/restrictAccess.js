const isbot = require('isbot');

module.exports = async (req, _, next) => {
  const userAgent = req.get('user-agent');

  if (isbot(userAgent)) {
    return next({
      status: 403,
      errors: [
        {
          msg: 'Forbidden',
        },
      ],
    });
  }

  return next();
};
