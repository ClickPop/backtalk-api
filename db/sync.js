const { sequelize } = require('./sequelize');
require('../models/user');
require('../models/question');
require('../models/response');
require('../models/role');
require('../models/survey');
module.exports = () => {
  // eslint-disable-next-line no-console
  sequelize.sync().then(() => console.info('Sequelize Synced'));
};
