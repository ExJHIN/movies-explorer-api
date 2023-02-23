const rateLimited = require('express-rate-limit');

const rateLimitedAuth = rateLimited({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    message: 'Кажется вы привысили лимит по запросам, повторите попытку снова через час!',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const limited = rateLimited({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Кажется вы привысили лимит по запросам, повторите попытку снова через 15 минут!',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  rateLimitedAuth,
  limited,
};
