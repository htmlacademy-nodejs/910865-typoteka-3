'use strict';

const {Router} = require(`express`);

const categoryValidator = require(`../middlewares/category-validator`);
const {HttpCode} = require(`../../constants`);

const categoryRoutes = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, categoryRoutes);

  categoryRoutes.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);

    res.status(HttpCode.OK).json(categories);
  });

  categoryRoutes.post(`/`, categoryValidator(categoryService), async (req, res) => {
    const {name} = req.body;
    const category = await categoryService.create({name});

    res.status(HttpCode.CREATED).json(category);
  });

  categoryRoutes.put(`/:id`, categoryValidator(categoryService), async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    const categoryUpdateStatus = await categoryService.update(id, {
      name,
    });

    res.status(HttpCode.OK).json(categoryUpdateStatus);
  });

  categoryRoutes.delete(`/:id`, async (req, res) => {
    const {id} = req.params;
    const categoryDropStatus = await categoryService.drop(id);

    res.status(HttpCode.OK).json(categoryDropStatus);
  });
};
