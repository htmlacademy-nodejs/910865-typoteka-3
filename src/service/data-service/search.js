'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
  }

  async findMatching(query) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: query
        }
      },
      include: [Aliase.CATEGORIES, {
        model: this._Comment,
        attributes: [`id`, `text`, `createdAt`, `updatedAt`],
        as: Aliase.COMMENTS,
      }],
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
