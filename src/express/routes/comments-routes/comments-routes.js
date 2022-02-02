'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);

const commentsRouter = new Router();
const api = getAPI();

commentsRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  const {user} = req.session;

  res.render(`comments/my`, {wrapper: {class: `wrapper, wrapper--nobackground`}, articles, user});
});
commentsRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const {user} = req.session;

  res.render(`comments/comments`, {wrapper: {class: `wrapper, wrapper--nobackground`}, articles, user});
});

module.exports = commentsRouter;
