'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.survey = this.belongsTo(models.Survey);
      this.options = this.hasMany(models.Optiion);
    }
  }
  Question.init(
    {
      prompt: DataTypes.TEXT,
      description: DataTypes.TEXT,
      type: {
        type: DataTypes.ENUM('bool', 'select', 'text'),
        allowNull: false,
        defaultValue: 'text',
      },
      survey_id: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Question',
    },
  );
  return Question;
};
