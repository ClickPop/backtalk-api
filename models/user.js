'use strict';
const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = [
  'password',
  'passwordResetToken',
  'passwordResetExpiry',
];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpiry: DataTypes.DATE,
    },
    {
      sequelize,
    },
  );

  User.associate = function (models) {
    User.hasMany(models.Survey);
    User.belongsToMany(models.Role, {
      through: 'UserRoles',
      onDelete: 'CASCADE',
    });
  };

  User.prototype.toJSON = function () {
    // hide protected fields
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }

    return attributes;
  };

  User.prototype.hasRole = async function (role = null) {
    let userRoles = await this.getRoles();
    return (
      userRoles !== null &&
      Array.isArray(userRoles) &&
      role !== null &&
      userRoles.some((r) => r.slug === role)
    );
  };

  User.prototype.isAdmin = function () {
    return this.hasRole('admin');
  };

  return User;
};
