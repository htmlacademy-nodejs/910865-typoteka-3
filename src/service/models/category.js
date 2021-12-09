'use strict';

const {Model, DataTypes} = require(`sequelize`);

const {ModelName, TableName} = require(`../../constants`);

class Category extends Model {}

const define = (sequelize) => Category.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: ModelName.CATEGORY,
  tableName: TableName.CATEGORY,
});

module.exports = define;
