const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  return res.json({ data: 'Welcome to this survey app!' });
});

module.exports = app;
