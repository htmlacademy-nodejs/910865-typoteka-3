'use strict';

class SearchService {
  constructor(article) {
    this._articles = article;
  }

  findMatching(query) {
    return this._articles.filter((article) => {
      const wordsInTitles = article.title.replace(/[.,?!]/g, ``).split(` `);
      const formattedWords = wordsInTitles.map((word) => word.toLowerCase());

      return (formattedWords.some((formattedWord) => formattedWord === query.toLowerCase()));
    });
  }
}

module.exports = SearchService;
