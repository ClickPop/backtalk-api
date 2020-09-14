require('dotenv').config();
const { create } = require('./modules/database-utils.js');
let config,
  name,
  recreate = false;

if (process.argv.includes('--testing')) {
  config = {
    host: process.env.DB_TEST_HOST || 'localhost',
    port: process.env.DB_TEST_PORT || 5432,
    user: process.env.DB_TEST_USERNAME || null,
    password: process.env.DB_TEST_PASSWORD || null,
  };
  name = process.env.DB_TEST_DATABASE || null;
} else {
  config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || null,
    password: process.env.DB_PASSWORD || null,
  };
  name = process.env.DB_DATABASE || null;
}

recreate = process.argv.includes('--recreate') ? true : false;

create(name, config, recreate);
