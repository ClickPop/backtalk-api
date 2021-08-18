const { sequelize } = require('../db/sequelize');

afterAll(async (done) => {
  sequelize.close().then(done());
  done();
});
