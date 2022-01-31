'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);
const upload = require(`../../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`../../../constants`);
const {prepareErrors, ensureArray} = require(`../../../utils`);

const articlesRouter = new Router();
const api = getAPI();

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

  if (activeCategoryTab === undefined) {
    return res.render(`errors/404`);
  }

  return res.render(`articles/articles-by-category`, {
    wrapper: {class: `wrapper`},
    articles,
    categories,
    page,
    totalPages,
    activeCategoryTab: activeCategoryTab.name
  });
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`articles/post`, {wrapper: {class: `wrapper`}, categories});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const data = {
    title: body.title,
    createdAt: `${body.date} ${new Date(Date.now()).getHours() < 10 ? `0${new Date(Date.now()).getHours()}` : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? `0${new Date(Date.now()).getMinutes()}` : new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds() < 10 ? `0${new Date(Date.now()).getSeconds()}` : new Date(Date.now()).getSeconds()}`,
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: file ? file.filename : ``,
    categories: ensureArray(body.category)
  };

  try {
    await api.createArticle(data);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();

    res.render(`articles/post`, {wrapper: {class: `wrapper`}, categories, validationMessages});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, {comments: false}).catch((err) => console.log(err));
  const categories = await api.getCategories();

  if (!article) {
    return res.render(`errors/404`);
  }

  return res.render(`articles/post`, {wrapper: {class: `wrapper`}, article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;
  const data = {
    title: body.title,
    createdAt: `${body.date} ${new Date(Date.now()).getHours() < 10 ? `0${new Date(Date.now()).getHours()}` : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? `0${new Date(Date.now()).getMinutes()}` : new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds() < 10 ? `0${new Date(Date.now()).getSeconds()}` : new Date(Date.now()).getSeconds()}`,
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: file ? file.filename : (body.photo || ``),
    categories: ensureArray(body.category)
  };

  try {
    await api.updateArticle(id, data);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();

    res.render(`articles/post`, {wrapper: {class: `wrapper`}, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, {comments: true}).catch((err) => console.log(err));
  const categoriesList = await api.getCategories(true);
  const categories = [];

  if (!article) {
    return res.render(`errors/404`);
  }

  article.categories.forEach((category) => categoriesList.forEach((it) => {
    if (it.name === category.name) {
      categories.push(it);
    }
  }));

  return res.render(`articles/post-detail`, {wrapper: {class: `wrapper`}, article, categories});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {text: message});
    res.redirect(`/articles/${id}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const [article, categories] = await Promise.all([
      api.getArticle(id, {comments: true}),
      api.getCategories(true)
    ]);

    res.render(`articles/post-detail`, {wrapper: {class: `wrapper`}, article, categories, validationMessages});
  }
});

module.exports = articlesRouter;
