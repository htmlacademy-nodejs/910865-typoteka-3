'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`main/main`, {wrapper: {class: `wrapper`}}));
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`, {wrapper: {class: `wrapper`}}));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`, {wrapper: {class: `wrapper`}}));
mainRouter.get(`/search`, (req, res) => res.render(`main/search`, {wrapper: {class: `wrapper-color`}}));
mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`, {wrapper: {class: `wrapper wrapper--nobackground`}}));

module.exports = mainRouter;
