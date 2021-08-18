require('dotenv').config();
const { Sequelize } = require('sequelize-cockroachdb');

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'survey_app_dev',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.DB_CRT,
    },
  },
});

module.exports = { sequelize };
