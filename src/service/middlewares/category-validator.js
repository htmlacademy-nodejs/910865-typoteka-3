'use strict';

const Joi = require(`joi`);

const {HttpCode, ErrorCategoryMessage, MIN_CATEGORY_NAME_LENGTH, MAX_CATEGORY_NAME_LENGTH} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string().min(MIN_CATEGORY_NAME_LENGTH).max(MAX_CATEGORY_NAME_LENGTH).required().messages({
    'string.empty': ErrorCategoryMessage.EMPTY,
    'string.min': ErrorCategoryMessage.CATEGORY_NAME_MIN,
    'string.max': ErrorCategoryMessage.CATEGORY_NAME_MAX
  })
});

module.exports = (service) => async (req, res, next) => {
  const category = req.body;
  const {error} = schema.validate(category, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const categoryById = await service.findByCategoryName(category.name);

  if (categoryById.length !== 0) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorCategoryMessage.CATEGORY_EXIST);
  }

  return next();
};
