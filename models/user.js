'use strict';
const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = ['password', 'createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpiry: DataTypes.DATE,
      role: DataTypes.STRING,
    },
    {
      sequelize,
    },
  );

  User.associate = function (models) {
    User.hasMany(models.Survey);
  };

  User.prototype.toJSON = function () {
    // hide protected fields
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  };

  User.prototype.hasRole = function (role = null) {
    let hasRole = false;
    role = typeof role === 'string' && role.length > 0 ? role : null;
    if (role !== undefined && this.role === role) {
      hasRole = true;
    }
    return hasRole;
  };

  User.prototype.isAdmin = function () {
    let isAdmin = this.hasRole('admin') || false;
    return isAdmin;
  };

  return User;
};
