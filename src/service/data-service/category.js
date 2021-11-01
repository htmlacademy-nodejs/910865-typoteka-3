'use strict';

class CategoryService {
  constructor(article) {
    this._articles = article;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      article.category.forEach((category) => acc.add(category));

      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
