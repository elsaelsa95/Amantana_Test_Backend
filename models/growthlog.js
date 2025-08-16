'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GrowthLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GrowthLog.belongsTo(models.User, {
        foreignKey:"UserId"
      }),
      GrowthLog.belongsTo(models.Plant, {
        foreignKey:"PlantId"
      })
    }
  }
  GrowthLog.init({
    date: DataTypes.DATE,
    height: DataTypes.INTEGER,
    diameter: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    PlantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GrowthLog',
  });
  return GrowthLog;
};