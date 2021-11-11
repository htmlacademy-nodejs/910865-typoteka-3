'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);

const commentsRouter = new Router();
const api = getAPI();

commentsRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`comments/my`, {wrapper: {class: `wrapper, wrapper--nobackground`}, articles});
});
commentsRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`comments/comments`, {wrapper: {class: `wrapper, wrapper--nobackground`}, articles});
});

module.exports = commentsRouter;
