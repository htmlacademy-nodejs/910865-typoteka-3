'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findMatching(query) {
    const getKeysFromString = (str) => {
      const words = str.replace(/[.,?!]/g, ``).split(` `);

      return words.map((word) => word.toLowerCase());
    };

    return this._articles.filter((article) => {
      const formattedWords = getKeysFromString(query);

      return formattedWords.some((formattedWord) => article.title.toLowerCase().includes(formattedWord));
    });
  }
}

module.exports = SearchService;
