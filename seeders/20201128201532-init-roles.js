'use strict';

const { User, Role } = require('../models');

const admins = [
  'sean.metzgar@gmail.com',
  'sean@clickpopmedia.com',
  'chris@clickpopmedia.com',
  'graham@clickpopmedia.com',
];

module.exports = {
  up: async () => {
    let roleAdmin = await Role.findOne({ where: { slug: 'admin' } });
    if (roleAdmin !== null) {
      for (let user of admins) {
        let loadedUser = await User.findOne({ where: { email: user } });
        if (loadedUser !== null) {
          await loadedUser.addRole(roleAdmin);
          loadedUser = null;
        }
      }
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserRoles', null, {
      truncate: true,
      cascade: true,
    });
  },
};
