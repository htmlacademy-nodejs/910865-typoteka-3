'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findMatching(query) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: query
        }
      },
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
