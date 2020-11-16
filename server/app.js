require('dotenv').config();
require('../helpers/prototypes');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const restrictAccess = require('../middleware/restrictAccess');

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use(
  require('cors')({
    origin:
      process.env.NODE_ENV !== 'production' ? '*' : process.env.CLIENT_URL,
  }),
);

// Restrict Access: Disallow Robots/Crawlers if in production
// Enable Morgan logger on anything except production for testing
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(restrictAccess);
}

// Default Route
app.get('/', (req, res) => {
  return res.json({ data: 'Welcome to this survey app!' });
});

// API (v1) Routes Loader
app.use('/api/v1', require('../routes/v1/v1-index'));

app.all('*', (req, res) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

// Error Handler
app.use((err, _req, res) => {
  console.error(err.stack);
  return res.status(err.status).json({ errors: err.errors });
});

module.exports = app;
