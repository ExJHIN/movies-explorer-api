require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_SECRET_DEVELOP } = require('../constants');

const { TOKEN_ERROR, LOG_IN_INFO } = require('../constants');
const AuthorizationError = require('../errors/authorizationError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw next(new AuthorizationError(LOG_IN_INFO));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : JWT_SECRET_DEVELOP);
  } catch (err) {
    throw next(new AuthorizationError(TOKEN_ERROR));
  }

  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
