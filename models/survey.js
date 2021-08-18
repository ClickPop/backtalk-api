'use strict';
const { sequelize } = require('../db/sequelize');
const { Model, DataTypes } = require('sequelize');

class Survey extends Model {}
Survey.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    respondent: DataTypes.BOOLEAN,
    isPublic: DataTypes.BOOLEAN,
    friendlyNames: DataTypes.JSONB,
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

module.exports = Survey;
