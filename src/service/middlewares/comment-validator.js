'use strict';

const Joi = require(`joi`);

const {HttpCode, ErrorCommentMessage, MIN_COMMENT_TEXT_LENGTH} = require(`../../constants`);

const schema = Joi.object({
  text: Joi.string().min(MIN_COMMENT_TEXT_LENGTH).required().messages({
    'string.empty': ErrorCommentMessage.EMPTY,
    'string.min': ErrorCommentMessage.TEXT
  })
});

module.exports = (req, res, next) => {
  const comment = req.body;
  const {error} = schema.validate(comment, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
