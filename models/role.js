'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {}
  Role.init(
    {
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
    },
  );

  Role.associate = function (models) {
    Role.belongsToMany(models.User, {
      through: 'UserRoles',
      onDelete: 'CASCADE',
    });
  };

  return Role;
};
