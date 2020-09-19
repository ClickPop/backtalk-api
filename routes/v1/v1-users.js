const express = require('express');
const { User } = require('../../models');
const { hash } = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const user = await User.create(
      {
        email,
        name,
        password: await hash(password, 10),
      },
      {},
    );

    return res.status(201).json({
      registered: true,
      users: {
        email: user.email,
      },
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
