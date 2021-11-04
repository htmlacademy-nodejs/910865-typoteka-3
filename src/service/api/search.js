'use strict';

const {Router} = require(`express`);

const searchRoutes = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, (req, res) => {
    const {query} = req.query;

    res.json(searchService.findMatching(query));
  });
};
