'use strict';
const { sequelize } = require('../db/sequelize');
const { Model, DataTypes } = require('sequelize');

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

module.exports = Role;
