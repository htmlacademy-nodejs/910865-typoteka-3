'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const {ARTICLES_PER_PAGE, MAX_HOT_ELEMENTS} = require(`../../constants`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const page = +req.query.page || 1;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [articlesWithComments, hotArticles, {count, articles}, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getArticles({needCount: true}),
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const {user} = req.session;
  const comments = articlesWithComments.map((it) => it.comments).filter((article) => article.length !== 0).flat().slice(0, MAX_HOT_ELEMENTS);
  const articleCommentsCount = hotArticles.slice(0, MAX_HOT_ELEMENTS);

  res.render(`main/main`, {wrapper: {class: `wrapper`}, comments, articleCommentsCount, articles, page, totalPages, categories, user});
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
    const {email: userEmail} = req.body;

    res.render(`main/login`, {wrapper: {class: `wrapper`}, user, userEmail, validationMessages});
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

  res.render(`main/search`, {wrapper: {class: `wrapper-color`}, results, query, user});
});

module.exports = mainRouter;
