'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const categoryRoutes = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, categoryRoutes);

  categoryRoutes.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);

    res.status(HttpCode.OK).json(categories);
  });
};
