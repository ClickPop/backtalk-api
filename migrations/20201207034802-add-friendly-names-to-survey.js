'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Surveys', 'friendlyNames', {
      type: Sequelize.DataTypes.JSONB,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Surveys', 'friendlyNames');
  },
};
