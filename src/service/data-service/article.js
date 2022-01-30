'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);

    await article.addCategories(articleData.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
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

  async findPage({limit, offset, filterOption}) {
    const include = [Aliase.COMMENTS];

    if (filterOption) {
      include.push({
        model: this._Category,
        as: Aliase.CATEGORIES,
        where: {id: filterOption}
      });
    } else {
      include.push(Aliase.CATEGORIES);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, articles: rows};
  }
}

module.exports = ArticleService;
