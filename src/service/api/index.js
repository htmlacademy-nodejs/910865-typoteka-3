'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const {CategoryService, ArticleService, SearchService, CommentService} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService());
})();

module.exports = app;
