'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Survey extends Model {}
  Survey.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
    },
  );
  Survey.associate = function (models) {
    Survey.belongsTo(models.User);
    Survey.belongsToMany(models.Question, {
      through: 'SurveyQuestions',
      onDelete: 'CASCADE',
    });
    Survey.hasMany(models.Response);
  };
  return Survey;
};
