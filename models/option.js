'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.question = this.belongsTo(models.Question);
    }
  }
  Option.init(
    {
      text: DataTypes.TEXT,
      description: DataTypes.TEXT,
      value: DataTypes.STRING,
      trigger: DataTypes.STRING,
      question_id: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Option',
    },
  );
  return Option;
};
