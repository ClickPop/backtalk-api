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
  };

  // I don't think this works how we are expecting it to.
  // See https://sequelizedocs.fullstackacademy.com/instance-and-class-methods/
  User.toJSON = function () {
    // hide protected fields
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a];
    }
    return attributes;
  };

  return User;
};
