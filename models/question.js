'use strict';
const { sequelize } = require('../db/sequelize');
const { Model, DataTypes } = require('sequelize');

class Question extends Model {}
Question.init(
  {
    prompt: DataTypes.TEXT,
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('text'),
      allowNull: false,
      defaultValue: 'text',
    },
  },
  {
    sequelize,
  },
);
Question.associate = function (models) {
  Question.belongsToMany(models.Survey, {
    through: 'SurveyQuestions',
    onDelete: 'CASCADE',
  });
};
module.exports = Question;
