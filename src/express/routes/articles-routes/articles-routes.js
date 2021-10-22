'use strict';

const {Router} = require(`express`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`, {wrapper: {class: `wrapper`}}));
articlesRouter.get(`/add`, (req, res) => res.render(`articles/post`, {wrapper: {class: `wrapper`}}));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post-detail`, {wrapper: {class: `wrapper`}}));

module.exports = articlesRouter;
