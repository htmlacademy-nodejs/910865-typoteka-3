'use strict';

const {Model, DataTypes} = require(`sequelize`);

const {ModelName, TableName} = require(`../../constants`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: ModelName.COMMENT,
  tableName: TableName.COMMENT,
});

module.exports = define;
