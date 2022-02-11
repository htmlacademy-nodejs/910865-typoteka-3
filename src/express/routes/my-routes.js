'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);
const checkAdminRole = require(`../middlewares/check-admin-role`);
const authRedirect = require(`../middlewares/auth-redirect`);
const {prepareErrors} = require(`../../utils`);
const {ErrorCategoryMessage} = require(`../../constants`);

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
  const errorInputId = parseInt(id, 10);

  if (action === `update`) {
    try {
      await api.updateCategory(id, {name: newCategoryName});
      return res.redirect(`/my/categories`);
    } catch (error) {
      const validationEditMessages = prepareErrors(error);

      return res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, errorInputId, validationEditMessages, user});
    }
  }

  if (action === `delete`) {
    let hasArticles = false;
    let removeStatus;

    try {
      removeStatus = await api.deleteCategory(id);

      if (removeStatus === false) {
        hasArticles = true;
        throw new Error();
      }

      return res.redirect(`/my/categories`);
    } catch (error) {
      if (hasArticles) {
        return res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, errorInputId, validationEditMessages: ErrorCategoryMessage.CATEGORY_ARTICLES_NOT_EMPTY, user});
      }

      const validationEditMessages = prepareErrors(error);

      return res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, validationEditMessages, user});
    }
  }

  return res.render(`my/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}, categories, user});
});

module.exports = myRouter;
