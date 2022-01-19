'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../../api`);
const upload = require(`../../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`../../../constants`);

const articlesRouter = new Router();
const api = getAPI();

articlesRouter.get(`/category/:id`, async (req, res) => {
  let {page = 1} = req.query;

  page = +page;

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
articlesRouter.get(`/add`, (req, res) => res.render(`articles/post`, {wrapper: {class: `wrapper`}}));
articlesRouter.post(`/add`, upload.single(`upload`), (req, res, next) => {
  if (req.file === undefined) {
    return res.render(`errors/422`);
  }

  return next();
}, async (req, res) => {
  const {body, file} = req;
  const data = {
    title: body.title,
    createdDate: `${body.date} ${new Date(Date.now()).getHours() < 10 ? `0${new Date(Date.now()).getHours()}` : new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? `0${new Date(Date.now()).getMinutes()}` : new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds() < 10 ? `0${new Date(Date.now()).getSeconds()}` : new Date(Date.now()).getSeconds()}`,
    announce: body.announcement,
    fullText: body[`full-text`],
    pictures: file ? file.filename : [],
    category: [`IT`] // временная заглушка
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
  const article = await api.getArticle(id, {comments: true}).catch((err) => console.log(err));

  if (!article) {
    return res.render(`errors/404`);
  }

  return res.render(`articles/post`, {wrapper: {class: `wrapper`}, article});
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

module.exports = articlesRouter;
