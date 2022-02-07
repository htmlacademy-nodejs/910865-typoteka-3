'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);
const upload = require(`../../middlewares/upload`);
const {prepareErrors} = require(`../../../utils`);
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

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file ? file.filename : ``,
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    const validationMessages = prepareErrors(err);

    res.render(`main/sign-up`, {wrapper: {class: `wrapper`}, validationMessages});
  }
});

mainRouter.get(`/login`, (req, res) => res.render(`main/login`, {wrapper: {class: `wrapper`}}));

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  const results = await api.search(query);

  res.render(`main/search-result`, {wrapper: {class: `wrapper-color`}, results, query});
});

mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}}));

module.exports = mainRouter;
