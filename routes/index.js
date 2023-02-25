const index = require('express').Router();
const { rateLimitedAuth, limited } = require('../middlewares/rateLimiter');

const users = require('./users');
const movies = require('./movies');

const { auth } = require('../middlewares/auth');

const { loginValidator, registrationValidator } = require('../middlewares/validate');
const NotFoundError = require('../errors/notFoundError');

const {
  createUser,
  login,
} = require('../controllers/users');

index.post('/signin', [loginValidator, rateLimitedAuth], login);

index.post('/signup', [registrationValidator, rateLimitedAuth], createUser);

index.use(auth);

index.use('/users', limited, users);
index.use('/movies', limited, movies);

index.use((req, res, next) => {
  throw next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

module.exports = index;
