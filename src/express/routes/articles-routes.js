'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const authRedirect = require(`../middlewares/auth-redirect`);
const checkAdminRole = require(`../middlewares/check-admin-role`);
const {ARTICLES_PER_PAGE, ErrorArticleMessage} = require(`../../constants`);
const {prepareErrors, ensureArray} = require(`../../utils`);

const articlesRouter = new Router();
const api = getAPI();
const csrfProtection = csrf();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const page = +req.query.page || 1;
  const selectedCategoryId = parseInt(req.params.id, 10);
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, filterOption: selectedCategoryId}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const activeCategoryTab = categories.find((it) => it.id === selectedCategoryId);
  const {user} = req.session;

  if (activeCategoryTab === undefined) {
    return res.render(`errors/404`);
  }

  return res.render(`articles/articles-by-category`, {
    wrapper: {class: `wrapper`},
    articles,
    categories,
    page,
    totalPages,
    activeCategoryTab: activeCategoryTab.name,
    user
  });
});

articlesRouter.get(`/add`, authRedirect, checkAdminRole, csrfProtection, async (req, res) => {
  const categories = await api.getCategories();
  const {user} = req.session;

  res.render(`articles/post-add`, {wrapper: {class: `wrapper`}, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const categoryFormData = ensureArray(body.category);
  const data = {
    title: body.title,
    createdAt: `${body.date} ${new Date(Date.now()).getHours() < 10 ? `0${new Date(Date.now()).getHours()}` : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? `0${new Date(Date.now()).getMinutes()}` : new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds() < 10 ? `0${new Date(Date.now()).getSeconds()}` : new Date(Date.now()).getSeconds()}`,
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: file ? file.filename : (body.photo || ``),
    categories: categoryFormData[0] !== undefined ? categoryFormData : [],
    userId: user.id
  };

  try {
    await api.createArticle(data);
    res.redirect(`/my`);
  } catch (err) {
    let oldCategoryFormData = data.categories;
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();

    if (!oldCategoryFormData.includes(undefined)) {
      oldCategoryFormData = oldCategoryFormData.map((it) => ({
        id: parseInt(it, 10),
      }));
    }

    data.categories = oldCategoryFormData;

    res.render(`articles/post-add`, {wrapper: {class: `wrapper`}, ErrorArticleMessage, oldData: data, categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, authRedirect, checkAdminRole, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, {comments: false}).catch((err) => console.log(err)),
    api.getCategories()
  ]);
  const {user} = req.session;

  if (!article) {
    return res.render(`errors/404`);
  }

  return res.render(`articles/post-edit`, {wrapper: {class: `wrapper`}, article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;
  const {user} = req.session;
  const categoryFormData = ensureArray(body.category);
  const data = {
    title: body.title,
    createdAt: `${body.date} ${new Date(Date.now()).getHours() < 10 ? `0${new Date(Date.now()).getHours()}` : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? `0${new Date(Date.now()).getMinutes()}` : new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds() < 10 ? `0${new Date(Date.now()).getSeconds()}` : new Date(Date.now()).getSeconds()}`,
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: file ? file.filename : (body.photo || ``),
    categories: categoryFormData[0] !== undefined ? categoryFormData : [],
    userId: user.id
  };

  try {
    await api.updateArticle(id, data);
    res.redirect(`/my`);
  } catch (err) {
    let oldCategoryFormData = data.categories;
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();

    if (!oldCategoryFormData.includes(undefined)) {
      oldCategoryFormData = oldCategoryFormData.map((it) => ({
        id: parseInt(it, 10),
      }));
    }

    data.categories = oldCategoryFormData;
    data.id = id;

    res.render(`articles/post-edit`, {wrapper: {class: `wrapper`}, ErrorArticleMessage, article: data, categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const [article, categoriesList] = await Promise.all([
    api.getArticle(id, {comments: true}).catch((err) => console.log(err)),
    api.getCategories(true)
  ]);
  const categories = [];
  const {user} = req.session;

  if (!article) {
    return res.render(`errors/404`);
  }

  article.categories.forEach((category) => categoriesList.forEach((it) => {
    if (it.name === category.name) {
      categories.push(it);
    }
  }));

  return res.render(`articles/post-detail`, {wrapper: {class: `wrapper`}, article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id`, async (req, res) => {
  const {id} = req.params;

  await api.dropArticle(id);

  res.redirect(`/my`);
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;
  const {user} = req.session;

  try {
    await api.createComment(id, {text: message, userId: user.id});
    res.redirect(`/articles/${id}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const [article, categories] = await Promise.all([
      api.getArticle(id, {comments: true}),
      api.getCategories(true)
    ]);

    res.render(`articles/post-detail`, {wrapper: {class: `wrapper`}, article, categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/:articleId/comments/:commentId`, async (req, res) => {
  const {articleId, commentId} = req.params;

  await api.dropComment(articleId, commentId);

  res.redirect(`/my/comments`);
});

module.exports = articlesRouter;
