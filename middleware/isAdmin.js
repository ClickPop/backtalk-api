const { User } = require('../models');

module.exports = async (req, _, next) => {
  if (!req.user && !req.user.id)
    return next({
      status: 401,
      errors: [
        {
          msg: 'Unauthorized',
        },
      ],
    });

  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  if (!user && !user.isAdmin())
    return next({
      status: 401,
      errors: [
        {
          msg: 'Unauthorized',
        },
      ],
    });

  req.admin = user;

  return next();
};
