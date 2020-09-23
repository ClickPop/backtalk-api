'use strict';
const path = require('path');
require(path.resolve('helpers', 'prototypes'));
const { hash } = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    let usersObject = [
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
    ];

    usersObject = usersObject.isSeeded();

    return await queryInterface.bulkInsert('Users', usersObject);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      cascade: true,
    });
  },
};
