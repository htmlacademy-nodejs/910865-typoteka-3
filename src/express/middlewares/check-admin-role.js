'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (user.id !== 1) {
    return res.status(HttpCode.FORBIDDEN).send(`Отсутствуют права доступа!`);
  }

  return next();
};
