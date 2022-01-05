'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  res.render(`main/main`, {wrapper: {class: `wrapper`}, articles, categories});
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
