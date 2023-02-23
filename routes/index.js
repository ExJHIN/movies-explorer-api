const index = require('express').Router();
const { auth } = require('../middlewares/auth');
const { rateLimitedAuth, limited } = require('../middlewares/rateLimiter');

const users = require('./users');
const movies = require('./movies');

const { loginValidator, registrationValidator } = require('../middlewares/validate');
const NotFoundError = require('../errors/notFoundError');

const {
  createUser,
  login,
} = require('../controllers/users');

index.post('/signin', [loginValidator, rateLimitedAuth], login);

index.post('/signup', [registrationValidator, rateLimitedAuth], createUser);

index.use(auth, (next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

index.use('/users', auth, limited, users);
index.use('/movies', auth, limited, movies);

module.exports = index;
