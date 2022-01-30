'use strict';

const {Model, DataTypes} = require(`sequelize`);

const {ModelName, TableName} = require("../../constants");

class User extends Model {}

const define = (sequelize) => User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: ModelName.USER,
  tableName: TableName.USER
});

module.exports = define;
