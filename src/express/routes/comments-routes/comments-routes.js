'use strict';

const {Router} = require(`express`);

const commentsRouter = new Router();

commentsRouter.get(`/`, (req, res) => res.send(`/my`));
commentsRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = commentsRouter;
