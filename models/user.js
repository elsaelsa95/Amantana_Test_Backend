'use strict';
const { Model } = require('sequelize');
const { hash } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Plant), {
        foreignKey: "UserId"
      }
      User.hasOne(models.Treatment), {
        foreignKey:"UserId"
      }
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'farmer', 'agronomist'),
    verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, option) => {
    user.password = hash(user.password);
  });
  return User;
};