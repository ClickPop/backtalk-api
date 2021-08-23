const { sequelize } = require('./sequelize');
const { User } = require('../models/user');
const { Question } = require('../models/question');
const { Response } = require('../models/response');
const { Role } = require('../models/role');
const { Survey } = require('../models/survey');

User.associate(sequelize.models);
Role.associate(sequelize.models);
Survey.associate(sequelize.models);
Question.associate(sequelize.models);
Response.associate(sequelize.models);

module.exports = async () => {
  await sequelize.sync();
  // eslint-disable-next-line no-console
  console.info('Sequelize Synced');
};
