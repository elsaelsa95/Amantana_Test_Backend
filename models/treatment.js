'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Treatment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Treatment.belongsTo(models.Plant),{
        foreignKey: "PlantId"
      },
      Treatment.belongsTo(models.User),{
        foreignKey:"UserId"
      }
    }
  }
  Treatment.init({
    firstTreatment: DataTypes.DATE,
    lastTreatment: DataTypes.DATE,
    fertilizer: DataTypes.STRING,
    note: DataTypes.TEXT,
    UserId: DataTypes.STRING,
    PlantId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Treatment',
  });
  return Treatment;
};