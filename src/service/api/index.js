'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const {CategoryService, ArticleService, SearchService, CommentService} = require(`../data-service`);
const sequelize = require(`../lib/sequelize`);
const define = require(`../models`);

const app = new Router();

define(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
})();

module.exports = app;
