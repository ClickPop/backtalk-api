const { sequelize } = require('./models');

afterAll(async (done) => {
  await sequelize.close();
  done();
});
