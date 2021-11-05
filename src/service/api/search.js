'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const searchRoutes = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.statusCode(HttpCode.BAD_REQUEST).json([]);
    }

    const searchResults = searchService.findMatching(query);

    if (searchResults.length === 0) {
      res.statusCode(HttpCode.NOT_FOUND);

      return;
    }

    res.statusCode(HttpCode.OK).json(searchResults);
  });
};
