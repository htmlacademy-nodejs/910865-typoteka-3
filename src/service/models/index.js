'use strict';

const {Model} = require(`sequelize`);

const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const defineCategory = require(`./category`);
const Aliase = require(`./aliase`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);
  const Category = defineCategory(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: `articleCategory`, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: `articleCategory`, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
