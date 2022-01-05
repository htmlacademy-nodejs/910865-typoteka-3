'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData, {include: Aliase.COMMENTS});

    await article.addCategories(articleData.categories);

    return article;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments = ``) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push({
        model: this._Comment,
        attributes: [`id`, `text`, `createdAt`, `updatedAt`],
        as: Aliase.COMMENTS,
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
    });

    return articles.map((article) => article.get());
  }

  findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push({
        model: this._Comment,
        attributes: [`id`, `text`, `createdAt`, `updatedAt`],
        as: Aliase.COMMENTS,
      });
    }

    return this._Article.findByPk(id, {include});
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: {id},
    });

    return !!affectedRows;
  }
}

module.exports = ArticleService;
