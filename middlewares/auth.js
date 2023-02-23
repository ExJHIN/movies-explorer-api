require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_SECRET_DEVELOP } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const { TOKEN_ERROR, LOG_IN_INFO } = require('../constants');
const AuthorizationError = require('../errors/authorizationError');

const extractBearerToken = function (header) {
  return header.replace('Bearer ', '');
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw next(new AuthorizationError(LOG_IN_INFO));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEVELOP);
  } catch (err) {
    throw next(new AuthorizationError(TOKEN_ERROR));
  }

  req.user = payload;
  return next();
};

module.exports = {
  auth,
  JWT_SECRET,
};
