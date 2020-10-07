const { sequelize } = require('../models');

afterAll(async (done) => {
  sequelize.close().then(done());
  done();
});
