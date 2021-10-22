'use strict';

const {Router} = require(`express`);

const commentsRouter = new Router();

commentsRouter.get(`/`, (req, res) => res.render(`comments/my`, {wrapper: {class: `wrapper, wrapper--nobackground`}}));
commentsRouter.get(`/comments`, (req, res) => res.render(`comments/comments`, {wrapper: {class: `wrapper, wrapper--nobackground`}}));

module.exports = commentsRouter;
