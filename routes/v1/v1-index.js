const express = require('express');
const router = express.Router();

router.use('/auth', require('./v1-auth'));
router.use('/users', require('./v1-users'));

//eslint-disable-next-line
router.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

module.exports = router;
