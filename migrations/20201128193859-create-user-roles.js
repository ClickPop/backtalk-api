'use strict';

const { User, Role } = require('../models');

const admins = [
  'sean.metzgar@gmail.com',
  'sean@clickpopmedia.com',
  'chris@clickpopmedia.com',
  'graham@clickpopmedia.com',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRoles', {
      UserId: {
        type: Sequelize.BIGINT,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      RoleId: {
        type: Sequelize.BIGINT,
        defaultValue: null,
        references: {
          model: 'Roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

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
          let isAdmin = await loadedUser.hasRole(roleAdmin);
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
    await queryInterface.dropTable('UserRoles');
  },
};
