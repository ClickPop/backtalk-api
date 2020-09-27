'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Response extends Model {}

  Response.init(
    {
      value: DataTypes.STRING,
    },
    {
      sequelize,
    },
  );

  Response.associate = function (models) {
    Response.belongsTo(models.Question);

    Response.belongsTo(models.Session);
  };

  return Response;
};
