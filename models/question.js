'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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
    Question.hasMany(models.Response, {
      as: 'responses',
    });
    Question.belongsToMany(models.Survey, {
      through: 'SurveyQuestions',
      onDelete: 'CASCADE',
    });
  };
  return Question;
};
