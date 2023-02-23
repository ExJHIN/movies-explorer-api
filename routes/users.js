const users = require('express').Router();

const { updateUserValidator } = require('../middlewares/validate');

const {
  updateUser,
  gettingUserInfo,
} = require('../controllers/users');

users.get('/me', gettingUserInfo);

users.patch('/me', updateUserValidator, updateUser);

module.exports = users;
