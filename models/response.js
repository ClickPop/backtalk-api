'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Response extends Model {}

  Response.init(
    {
      data: DataTypes.JSONB,
      userAgent: DataTypes.STRING,
      ipAddress: DataTypes.INET,
      respondent: DataTypes.STRING,
    },
    {
      sequelize,
    },
  );

  Response.associate = function (models) {
    Response.belongsTo(models.Survey);
  };

  return Response;
};
