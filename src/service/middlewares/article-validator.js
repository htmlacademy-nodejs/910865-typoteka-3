'use strict';

const Joi = require(`joi`);

const {HttpCode, ErrorArticleMessage, MIN_TITLE_TEXT_LENGTH,
  MAX_TITLE_TEXT_LENGTH, MIN_ANNOUNCE_TEXT_LENGTH, MAX_ANNOUNCE_TEXT_LENGTH,
  MAX_TEXT_TEXT_LENGTH, MIN_CATEGORIES_NUMBER} = require(`../../constants`);

const schema = Joi.object({
  title: Joi.string().min(MIN_TITLE_TEXT_LENGTH).max(MAX_TITLE_TEXT_LENGTH).required().messages({
    'string.empty': ErrorArticleMessage.TITLE_REQUIRED,
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
  }),
  announce: Joi.string().min(MIN_ANNOUNCE_TEXT_LENGTH).max(MAX_ANNOUNCE_TEXT_LENGTH).required().messages({
    'string.empty': ErrorArticleMessage.ANNOUNCE_REQUIRED,
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
  }),
  fullText: Joi.string().max(MAX_TEXT_TEXT_LENGTH).allow(``).messages({
    'string.max': ErrorArticleMessage.TEXT_MAX,
  }),
  createdAt: Joi.string().isoDate().required().messages({
    'string.empty': ErrorArticleMessage.DATE
  }),
  picture: Joi.string().allow(``).pattern(/\.(?:jpg|png)$/i).messages({
    'string.pattern.base': ErrorArticleMessage.PICTURE
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(MIN_CATEGORIES_NUMBER).required().messages({
    'array.min': ErrorArticleMessage.CATEGORIES,
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  })
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
