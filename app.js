require('dotenv').config();
require('./helpers/prototypes');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  return res.json({ data: 'Welcome to this survey app!' });
});

app.use('/api/v1', require('./routes/v1/v1-index'));

app.all('*', (req, res) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

//eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.stack) console.error(err.stack);
  return res.status(err.status).json({ errors: err.errors });
});

module.exports = app;
