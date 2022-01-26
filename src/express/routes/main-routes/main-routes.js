'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);
const {ARTICLES_PER_PAGE} = require(`../../../constants`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const page = +req.query.page || 1;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main/main`, {wrapper: {class: `wrapper`}, articles, page, totalPages, categories});
});
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`, {wrapper: {class: `wrapper`}}));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`, {wrapper: {class: `wrapper`}}));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);

    res.render(`main/search-result`, {wrapper: {class: `wrapper-color`}, results});
  } catch (error) {
    res.render(`main/search-result`, {
      wrapper: {class: `wrapper-color`},
      results: []
    });
  }
});
mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}}));

module.exports = mainRouter;
