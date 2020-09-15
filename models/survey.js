'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.user = this.belongsTo(models.User);
      this.questions = this.hasMany(models.Question);
    }
  }
  Survey.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      userId: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'Survey',
    },
  );
  return Survey;
};
