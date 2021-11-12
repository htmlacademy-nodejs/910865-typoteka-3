'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);

const articlesRouter = new Router();
const api = getAPI();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`, {wrapper: {class: `wrapper`}}));
articlesRouter.get(`/add`, (req, res) => res.render(`articles/post`, {wrapper: {class: `wrapper`}}));
articlesRouter.post(`/add`, async (req, res) => {
  const {body} = req;
  const data = {
    title: body.title,
    createdDate: `${body.date}, ${new Date(Date.now()).getHours() < 10 ? `0${new Date(Date.now()).getHours()}` : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? `0${new Date(Date.now()).getMinutes()}` : new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds() < 10 ? `0${new Date(Date.now()).getSeconds()}` : new Date(Date.now()).getSeconds()}`,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: [`category`] // временная заглушка
  };

  try {
    await api.createArticle(data);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);

  res.render(`./articles/post-detail`, {wrapper: {class: `wrapper`}, article});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post-detail`, {wrapper: {class: `wrapper`}}));

module.exports = articlesRouter;
