'use strict';

const {Router} = require(`express`);

const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);

const {HttpCode, NOT_FOUND_ERROR_MESSAGE} = require(`../../constants`);

const articleRoutes = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, articleRoutes);

  articleRoutes.get(`/`, async (req, res) => {
    const {comments, offset, limit, filterOption} = req.query;
    let result;

    if (limit || offset) {
      result = await articleService.findPage({limit, offset, filterOption});
    } else {
      result = await articleService.findAll(comments);
    }

    res.status(HttpCode.OK)
      .json(result);
  });

  articleRoutes.get(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  articleRoutes.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id);

    res.status(HttpCode.OK)
      .json(comments);
  });

  articleRoutes.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    res.status(HttpCode.CREATED)
      .json(article);
  });

  articleRoutes.put(`/:articleId`, [articleValidator, articleExist(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const articleUpdateStatus = await articleService.update(articleId, req.body);

    if (req.body.categories) {
      const article = await articleService.findOne(articleId);

      await article.categories.forEach((it) => article.removeCategory(it));
      await article.addCategories(req.body.categories);
    }

    res.status(HttpCode.OK)
      .json(articleUpdateStatus);
  });

  articleRoutes.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(NOT_FOUND_ERROR_MESSAGE);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  articleRoutes.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId, articleId} = req.params;
    const commentsById = await commentService.findAll(articleId);
    const commentSearchMatches = commentsById.filter((it) => it.id === parseInt(commentId, 10));

    if (commentSearchMatches.length === 0) {
      return res.status(HttpCode.NOT_FOUND)
        .send(NOT_FOUND_ERROR_MESSAGE);
    }

    const deletedComment = await commentService.drop(commentId);

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  articleRoutes.post(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const {text} = req.body;

    if (!text) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const comment = await commentService.create(article.id, text);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
