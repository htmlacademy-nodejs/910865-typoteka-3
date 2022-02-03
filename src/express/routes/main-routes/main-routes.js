'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);
const upload = require(`../../middlewares/upload`);
const authRedirect = require(`../../middlewares/auth-redirect`);
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
  const {user} = req.session;

  res.render(`main/main`, {wrapper: {class: `wrapper`}, articles, page, totalPages, categories, user});
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

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);

    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const {user} = req.session;

    res.render(`main/login`, {wrapper: {class: `wrapper`}, user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  const results = await api.search(query);
  const {user} = req.session;

  res.render(`main/search-result`, {wrapper: {class: `wrapper-color`}, results, query, user});
});

mainRouter.get(`/categories`, authRedirect, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, user});
});

mainRouter.post(`/categories`, async (req, res) => {
  try {
    const newCategory = await api.createCategory({name: req.body[`add-category`]});

    res.redirect(`/articles/category/${newCategory.id}`);
  } catch (error) {
    const validationAddMessages = prepareErrors(error);
    const {user} = req.session;
    const categories = await api.getCategories();

    res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, validationAddMessages, user});
  }
});

mainRouter.post(`/categories/:id`, async (req, res) => {
  const {id} = req.params;
  const {action} = req.body;
  const inputFieldName = `category-${id}`;
  const newCategoryName = req.body[inputFieldName];
  const categories = await api.getCategories();
  const {user} = req.session;

  if (action === `update`) {
    try {
      await api.updateCategory(id, {name: newCategoryName});
      res.redirect(`/articles/category/${id}`);
    } catch (error) {
      const validationEditMessages = prepareErrors(error);
      const errorInputId = parseInt(id, 10);

      res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, errorInputId, validationEditMessages, user});
    }
  }

  if (action === `delete`) {
    try {
      await api.deleteCategory(id);
      res.redirect(`/categories`);
    } catch (error) {
      const validationEditMessages = prepareErrors(error);

      res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, validationEditMessages, user});
    }
  }
});

module.exports = mainRouter;
