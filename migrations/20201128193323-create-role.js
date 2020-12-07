'use strict';

const { Role } = require('../models');

const defaultRoles = [
  {
    slug: 'admin',
    name: 'Administrator',
    description: 'Role assigned to backtalk administrators',
  },
  {
    slug: 'user',
    name: 'Standard User',
    description: 'Default user role assigned to all new accounts',
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
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

    for (let role of defaultRoles) {
      await Role.create(role);
    }
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Roles');
  },
};
