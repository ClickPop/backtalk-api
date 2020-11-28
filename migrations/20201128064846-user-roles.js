'use strict';

const { User } = require('../models');

const admins = [
  'sean.metzgar@gmail.com',
  'sean@clickpopmedia.com',
  'chris@clickpopmedia.com',
  'graham@clickpopmedia.com',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.DataTypes.STRING,
    });

    for (let email of admins) {
      let tempAdmin = null;
      tempAdmin = await User.findOne({ where: { email: email } });
      if (tempAdmin !== null) {
        tempAdmin.role = 'admin';
        await tempAdmin.save();
      }
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'role');
  },
};
