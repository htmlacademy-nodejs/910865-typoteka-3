'use strict';

const {HttpCode, BAD_REQUEST_MESSAGE, ARTICLE_KEYS} = require(`../../constants`);

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const oddKeys = keys.filter((it, index) => it !== ARTICLE_KEYS[index]);
  const keysExists = ARTICLE_KEYS.every((key) => keys.includes(key));

  if (!keysExists || Boolean(oddKeys.length)) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(BAD_REQUEST_MESSAGE);
  }

  return next();
};
