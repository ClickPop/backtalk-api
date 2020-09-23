'use strict';
const { hash } = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert('Users', [
      {
        email: 'sean@clickpopmedia.com',
        name: 'Sean Metzgar (Testing)',
        password: await hash('Password1!', 10),
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      cascade: true,
    });
  },
};
