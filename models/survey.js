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
      this.user = this.belongsTo(models.User, {
        onDelete: 'SET DEFAULT',
      });
      this.questions = this.hasMany(models.Question, { onDelete: 'SET NULL' });
    }
  }
  Survey.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
    },
  );
  return Survey;
};
