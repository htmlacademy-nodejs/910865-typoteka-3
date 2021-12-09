'use strict';

const {Model, DataTypes} = require(`sequelize`);

const {ModelName, TableName} = require(`../../constants`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  pictures: DataTypes.STRING,
  fullSizePictures: DataTypes.STRING,
}, {
  sequelize,
  modelName: ModelName.ARTICLE,
  tableName: TableName.ARTICLE,
  timestamps: true,
});

module.exports = define;
