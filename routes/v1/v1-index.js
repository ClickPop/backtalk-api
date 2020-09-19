const express = require('express');
const router = express.Router();

router.use('/surveys', require('./v1-surveys.js'));

module.exports = router;
