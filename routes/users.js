const users = require('express').Router();
const { Joi, celebrate, errors } = require('celebrate');

const {
  updateUser,
  gettingUserInfo,
} = require('../controllers/users');

users.get('/me', gettingUserInfo);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

users.use(errors());

module.exports = users;
