'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {}
  Session.init(
    {
      SurveyId: DataTypes.BIGINT,
      userAgent: DataTypes.STRING,
      ipAddress: DataTypes.INET,
      respondent: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Session',
    },
  );
  Session.associate = function (models) {
    Session.belongsTo(models.Survey);
    Session.hasMany(models.Response);
  };
  return Session;
};
