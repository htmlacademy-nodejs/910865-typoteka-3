'use strict';

const Joi = require(`joi`);

const {HttpCode, MIN_PASSWORD_LENGTH, ErrorRegisterMessage} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.empty': ErrorRegisterMessage.NAME_REQUIRED,
    'string.pattern.base': ErrorRegisterMessage.NAME
  }),
  surname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.empty': ErrorRegisterMessage.SURNAME_REQUIRED,
    'string.pattern.base': ErrorRegisterMessage.SURNAME
  }),
  email: Joi.string().email().required().messages({
    'string.empty': ErrorRegisterMessage.EMAIL_REQUIRED,
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(MIN_PASSWORD_LENGTH).required().messages({
    'string.empty': ErrorRegisterMessage.PASSWORD_REQUIRED,
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'string.empty': ErrorRegisterMessage.PASSWORD_REPEATED_REQUIRED,
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().required().messages({
    'string.empty': ErrorRegisterMessage.AVATAR
  })
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
