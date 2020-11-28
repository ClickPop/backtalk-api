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

  // User.prototype.hasRole = function (role = null) {
  //   let hasRole = false;
  //   // role = typeof role === 'string' && role.length > 0 ? role : null;
  //   // if (role !== null) {
  //   //   let userRoles = this.getRoles();
  //   //   console.log()
  //   //   hasRole = true;
  //   // }
  //   return hasRole;
  // };

  // User.prototype.isAdmin = function () {
  //   let isAdmin = this.hasRole('admin') || false;
  //   return isAdmin;
  // };

  return User;
};
