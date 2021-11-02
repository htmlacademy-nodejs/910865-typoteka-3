'use strict';

const {Router} = require(`express`);

const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);

const {HttpCode, NOT_FOUND_ERROR_MESSAGE} = require(`../../constants`);

const articleRoutes = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, articleRoutes);

  articleRoutes.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    res.status(HttpCode.OK)
      .json(articles);
  });

  articleRoutes.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  articleRoutes.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  articleRoutes.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    res.status(HttpCode.CREATED)
      .json(article);
  });

  articleRoutes.put(`/:articleId`, [articleValidator, articleExist(articleService)], (req, res) => {
    const {articleId} = req.params;
    const article = articleService.update(articleId, req.body);

    res.status(HttpCode.OK)
      .json(article); // ? http req with bad obj or bad articleId causes err
  });

  articleRoutes.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(NOT_FOUND_ERROR_MESSAGE);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  articleRoutes.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    res.status(HttpCode.OK)
      .json(deletedComment);
  });

  articleRoutes.post(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    res.status(HttpCode.CREATED)
      .json(comment);
  });
};
