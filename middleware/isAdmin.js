const { User } = require('../models/user');

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
  const isAdmin = await user.isAdmin();
  if (!user || !isAdmin)
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
