'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;

const {FILE_NAME} = require(`../../../../constants`);

const mainRouter = new Router();

mainRouter.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);

    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});

module.exports = mainRouter;
