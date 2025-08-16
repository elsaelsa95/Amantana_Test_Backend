'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plant.belongsTo(models.User, {
        foreignKey:{
          name: "UserId",
          allowNull:true
        },
        onDelete:"SET NULL"
      }),
      Plant.hasOne(models.Treatment), {
        foreignKey:"PlantId"
      }
    }
  }
  Plant.init({
    name: DataTypes.STRING,
    species: DataTypes.STRING,
    location: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    plantedDate:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Plant',
  });
  return Plant;
};