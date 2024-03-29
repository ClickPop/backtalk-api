'use strict';
const { hash } = require('bcryptjs');
const { sequelize } = require('../db/sequelize');
const queryInterface = sequelize.getQueryInterface();
module.exports = {
  up: async () => {
    return await queryInterface.bulkInsert('Users', [
      {
        email: 'graham@clickpopmedia.com',
        name: 'Graham Vasquez',
        password: await hash('Password1!', 10),
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
      {
        email: 'chris@clickpopmedia.com',
        name: 'Chris Vasquez',
        password: await hash('Password1!', 10),
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
      {
        email: 'sean@clickpopmedia.com',
        name: 'Sean Metzgar',
        password: await hash('Password1!', 10),
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
    ]);
  },

  down: async () => {
    return await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      cascade: true,
    });
  },
};
