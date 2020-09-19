const express = require('express');
const router = express.Router();

router.use('/auth', require('./v1-auth'));
router.use('/users', require('./v1-users'));

module.exports = router;
