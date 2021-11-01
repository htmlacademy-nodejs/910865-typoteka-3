'use strict';

const {HttpCode, BAD_REQUEST_MESSAGE, ARTICLE_KEYS} = require(`../../constants`);

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = ARTICLE_KEYS.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(BAD_REQUEST_MESSAGE);
  }

  next();
};
