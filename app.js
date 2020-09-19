require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  return res.json({ data: 'Welcome to this survey app!' });
});

app.use(passport.initialize());

app.use('/api/v1', require('./routes/v1/v1-index'));

module.exports = app;
