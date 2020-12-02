'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Surveys', 'isPublic', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Surveys', 'isPublic');
  },
};
