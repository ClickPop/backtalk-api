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
    let roleUser = await Role.findOne({ where: { slug: 'user' } });
    let roleAdmin = await Role.findOne({ where: { slug: 'admin' } });

    if (roleUser !== null) {
      let allUsers = await User.findAll();

      if (Array.isArray(allUsers)) {
        allUsers.map(async (loadedUser) => {
          let roles = await loadedUser.getRoles();

          if (!Array.isArray(roles) || !roles.length) {
            await loadedUser.addRole(roleUser);
          }
        });
      }
    }

    if (roleAdmin !== null) {
      for (let user of admins) {
        let loadedUser = await User.findOne({
          where: { email: user },
        });

        if (loadedUser !== null) {
          let isAdmin = await loadedUser.hasRole('admin');
          if (!isAdmin) {
            await loadedUser.addRole(roleAdmin);
            await loadedUser.removeRole(roleUser);
          }

          loadedUser = null;
          isAdmin = false;
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
