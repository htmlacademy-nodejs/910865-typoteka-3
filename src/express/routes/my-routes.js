'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);
const checkAdminRole = require(`../middlewares/check-admin-role`);
const authRedirect = require(`../middlewares/auth-redirect`);
const {prepareErrors} = require(`../../utils`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, authRedirect, checkAdminRole, async (req, res) => {
  const articles = await api.getArticles();
  const {user} = req.session;

  res.render(`my/my`, {wrapper: {class: `wrapper, wrapper--nobackground`}, articles, user});
});

myRouter.get(`/comments`, authRedirect, checkAdminRole, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const {user} = req.session;

  res.render(`my/comments`, {wrapper: {class: `wrapper, wrapper--nobackground`}, articles, user});
});

myRouter.get(`/categories`, authRedirect, checkAdminRole, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, user});
});

myRouter.post(`/categories`, async (req, res) => {
  try {
    await api.createCategory({name: req.body[`add-category`]});

    res.redirect(`/my/categories`);
  } catch (error) {
    const validationAddMessages = prepareErrors(error);
    const {user} = req.session;
    const categories = await api.getCategories();

    res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, validationAddMessages, user});
  }
});

myRouter.post(`/categories/:id`, async (req, res) => {
  const {id} = req.params;
  const {action} = req.body;
  const inputFieldName = `category-${id}`;
  const newCategoryName = req.body[inputFieldName];
  const categories = await api.getCategories();
  const {user} = req.session;

  if (action === `update`) {
    try {
      await api.updateCategory(id, {name: newCategoryName});
      res.redirect(`/my/categories`);
    } catch (error) {
      // ??? почему при ошибке перебрасывает с /my/categories на /my/categories/${id} при ошибке в редактировании
      const validationEditMessages = prepareErrors(error);
      const errorInputId = parseInt(id, 10);

      res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, errorInputId, validationEditMessages, user});
    }
  }

  if (action === `delete`) {
    try {
      await api.deleteCategory(id);
      res.redirect(`/my/categories`);
    } catch (error) {
      const validationEditMessages = prepareErrors(error);

      res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, validationEditMessages, user});
    }
  }
});

module.exports = myRouter;
