require('dotenv').config();
require('../helpers/prototypes');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const restrictAccess = require('../middleware/restrictAccess');
const cors = require('cors');
const { rootResponse } = require('../helpers/apiDetails');
require('../db/sync');

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

const corsOpts = {
  origin: process.env.NODE_ENV === 'production' ? /backtalk\.io$/ : '*',
  credentials: true,
};

app.use(cors(corsOpts));

// Restrict Access: Disallow Robots/Crawlers if in production
// Enable Morgan logger on anything except production for testing
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(restrictAccess);
}

// Default Route
app.get('/', (req, res) => {
  return res.json(rootResponse);
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
