require('dotenv').config();
const { Sequelize } = require('sequelize-cockroachdb');

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'survey_app_db',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions:
    process.env.NODE_ENV === 'test'
      ? undefined
      : {
          ssl: {
            rejectUnauthorized: false,
            ca: process.env.DB_CRT,
          },
        },
});

module.exports = { sequelize };
