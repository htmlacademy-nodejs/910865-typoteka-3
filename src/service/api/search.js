'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const searchRoutes = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, async (req, res) => {
    const {query = ``} = req.query;
    const searchResults = await searchService.findMatching(query);

    return res.status(HttpCode.OK)
      .json(searchResults);
  });
};
